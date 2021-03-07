/**
 * Queries sobre AWS DynamoDB
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


/**
 * Crea un match entre equipos
 * @param {Object} db Conexion a DynamoDB
 * @param {String} tableName Nombre de la tabla
 * @param {String} hashKey Id del equipo solicitante
 * @param {String} rangeKey Id del equipo solicitado
 * @param {String} createdOn Fecha de creacion
 * @param {String} expireOn Fecha de expiracion
 * @param {String} allowedPatches Numero de parches permitidos
 * @param {String[]} positions Posiciones requeridas para parchar
 * @param {String} ageMinFilter Edad minima de los jugadores
 * @param {String} ageMaxFilter Edad maxima de los jugadores
 * @param {String[]} matchFilter Tipo de juego del partido
 * @param {Object} schedule Horario y fecha del encuentro
 * @param {Object} reqStat Estado de la solicitud
 * @param {String} geohash Hash de geolocalizacion
 * @param {Object} coords Coordenadas de la ubicacion
 * @param {String} stadiumGeohash Hash de geolocalizacion del club deportivo
 * @param {String} stadiumId Id del club deportivo donde se jugara
 * @param {String} courtId Id de la cancha donde se jugara el partido
 * @param {String[]} genderFilter Sexo de los equipos
 * @param {Function} fn Funcion callback
 */
const addMatch = (db, tableName, hashKey, rangeKey, createdOn, expireOn, allowedPatches,
    positions, ageMinFilter, ageMaxFilter, matchFilter, schedule, reqStat, geohash,
    coords, stadiumGeohash, stadiumId, courtId, genderFilter, fn) => {
    db.putItem({
        TableName: tableName,
        Item: {
            hashKey: { S: hashKey },
            rangeKey: { S: rangeKey },
            createdOn: { S: createdOn },
            expireOn: { S: expireOn },
            allowedPatches: { N: allowedPatches },
            positions: { SS: positions },
            ageMinFilter: { N: ageMinFilter },
            ageMaxFilter: { N: ageMaxFilter },
            matchFilter: { SS: matchFilter },
            schedule: { M: schedule },
            reqStat: { M: reqStat },
            geohash: { S: geohash },
            coords: { M: coords },
            stadiumGeohash: { S: stadiumGeohash },
            stadiumId: { S: stadiumId },
            courtId: { N: courtId },
            genderFilter: { SS: genderFilter }
        }
    }, function(err, data) {
        if (err) fn(err);
        else
            fn(null, {
                teamId1: hashKey.split('#')[1],
                teamId2: rangeKey.split('#')[1],
                createdOn,
                expireOn,
                allowedPatches,
                positions,
                ageMinFilter,
                ageMaxFilter,
                matchFilter,
                schedule: JSON.stringify(schedule),
                reqStat: JSON.stringify(reqStat),
                geohash,
                coords: JSON.stringify(coords),
                stadiumGeohash,
                stadiumId,
                courtId,
                genderFilter
            });
    });
}

module.exports.addMatch = addMatch;
