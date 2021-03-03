/**
 * Queries sobre AWS DynamoDB
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


/**
 * Actualiza informacion del partido
 * @param {Object} db Conexion a DynamoDB
 * @param {String} tableName Nombre de la tabla
 * @param {String} hashKey Id del equipo solicitante
 * @param {String} rangeKey Id del equipo solicitado
 * @param {String} allowedPatches Numero de parches permitidos
 * @param {String[]} positions Posiciones buscadas para parchar
 * @param {String[]} matchFilter Tipo de juego
 * @param {Object} schedule Fecha de partido
 * @param {Object} reqStat Estado de la solicitud
 * @param {String} stadiumGeohash Hash de geolocalizacion del club deportivo
 * @param {String} stadiumId Id del club deportivo
 * @param {String} courtId Id de la cancha
 * @param {String[]} genderFilter Sexo de los equipos
 * @param {String} ageMinFilter Edad minima de los jugadores
 * @param {String} ageMaxFilter Edad maxima de los jugadores
 * @param {String} geohash Hash de geolocalizacion (solo para entregar en output)
 * @param {Object} coords Coordenadas de la ubicacion (solo para entregar en output)
 * @param {Function} fn Funcion callback
 */
const updateMatch = (db, tableName, hashKey, rangeKey, allowedPatches, positions, matchFilter, schedule,
    reqStat, stadiumGeohash, stadiumId, courtId, genderFilter, ageMinFilter, ageMaxFilter, geohash,
    coords, fn) => {
    db.updateItem({
        TableName: tableName,
        Key: {
            hashKey: { S: hashKey },
            rangeKey: { S: rangeKey }
        },
        UpdateExpression: `
            set allowedPatches = :v1, positions = :v2, matchFilter = :v3,
            schedule = :v4, reqStat = :v5, stadiumGeohash = :v6, stadiumId = :v7,
            courtId = :v8, genderFilter = :v9, ageMinFilter = :v10, ageMaxFilter = :v11
        `,
        ExpressionAttributeValues: {
            ':v1': { N: allowedPatches },
            ':v2': { SS: positions },
            ':v3': { SS: matchFilter },
            ':v4': { M: schedule },
            ':v5': { M: reqStat },
            ':v6': { S: stadiumGeohash },
            ':v7': { S: stadiumId },
            ':v8': { N: courtId },
            ':v9': { SS: genderFilter },
            ':v10': { N: ageMinFilter },
            ':v11': { N: ageMaxFilter }
        }
    }, function(err, data) {
        if (err) fn(err);
        else fn(null, {
            teamId1: hashKey.split('#')[1],
            teamId2: rangeKey.split('#')[1],
            allowedPatches,
            positions,
            matchFilter,
            schedule: JSON.stringify(schedule),
            reqStat: JSON.stringify(reqStat),
            stadiumGeohash,
            stadiumId,
            courtId,
            genderFilter,
            ageMinFilter,
            ageMaxFilter,
            geohash,
            coords
        });
    });
}

/**
 * Elimina un partido
 * @param {Object} db Conexion a DynamoDB
 * @param {String} tableName Nombre de la tabla
 * @param {String} hashKey Id del equipo solicitante
 * @param {String} rangeKey Id del equipo solicitado
 * @param {Function} fn Funcion callback
 */
const deleteMatch = (db, tableName, hashKey, rangeKey, fn) => {
    db.deleteItem({
        TableName: tableName,
        Key: {
            hashKey: { S: hashKey },
            rangeKey: { S: rangeKey }
        }
    },
    function(err, data) {
        if (err) fn(err);
        else {
            const err = new Error(JSON.stringify({
                code: 'MatchDeletedException',
                message: `Partido eliminado.`
            }));
            fn(err);
        }
    });
}

module.exports.updateMatch = updateMatch;
module.exports.deleteMatch = deleteMatch;
