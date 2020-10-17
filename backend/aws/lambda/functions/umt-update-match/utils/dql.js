/**
 * Queries sobre AWS DynamoDB
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


/**
 * Obtiene un partido
 * @param {Object} db Conexion a DynamoDB
 * @param {String} tableName Nombre de la tabla
 * @param {String} hashKey Id del equipo solicitante
 * @param {String} rangeKey Id del equipo solicitado
 * @param {Function} fn Funcion callback
 */
const getMatch = (db, tableName, hashKey, rangeKey, fn) => {
    db.getItem({
        TableName: tableName,
        Key: {
            "hashKey": { S: hashKey },
            "rangeKey": { S: rangeKey }
        }
    },
    function(err, data) {
        if (err) fn(err);
        else fn(null, data);
    });
}

/**
 * Actualiza informacion del partido
 * @param {Object} db Conexion a DynamoDB
 * @param {String} tableName Nombre de la tabla
 * @param {String} hashKey Id del equipo solicitante
 * @param {String} rangeKey Id del equipo solicitado
 * @param {String} allowedPatches Numero de parches permitidos
 * @param {String[]} positions Posiciones buscadas para parchar
 * @param {String[]} matchTypes Tipo de juego
 * @param {Object} schedule Fecha de partido
 * @param {Object} reqStat Estado de la solicitud
 * @param {String} stadiumGeohash Hash de geolocalizacion del club deportivo
 * @param {String} stadiumId Id del club deportivo
 * @param {String} courtId Id de la cancha
 * @param {String[]} genderFilter Filtro de sexo
 * @param {Function} fn Funcion callback
 */
const updateMatch = (db, tableName, hashKey, rangeKey, allowedPatches, positions, matchTypes, schedule,
    reqStat, stadiumGeohash, stadiumId, courtId, genderFilter, fn) => {
    db.updateItem({
        TableName: tableName,
        Key: {
            "hashKey": { S: hashKey },
            "rangeKey": { S: rangeKey }
        },
        UpdateExpression: "set allowedPatches = :v1, positions = :v2, matchTypes = :v3,\
            schedule = :v4, reqStat = :v5, stadiumGeohash = :v6, stadiumId = :v7,\
            courtId = :v8, genderFilter = :v9",
        ExpressionAttributeValues: {
            ":v1": { N: allowedPatches },
            ":v2": { SS: positions },
            ":v3": { SS: matchTypes },
            ":v4": { M: schedule },
            ":v5": { M: reqStat },
            ":v6": { S: stadiumGeohash },
            ":v7": { S: stadiumId },
            ":v8": { N: courtId },
            ":v9": { SS: genderFilter }
        }
    }, function(err, data) {
        if (err) fn(err);
        else fn(null, {
            teamId1: hashKey.split('#')[1],
            teamId2: rangeKey.split('#')[1],
            allowedPatches,
            positions,
            matchTypes,
            schedule,
            reqStat,
            stadiumGeohash,
            stadiumId,
            courtId,
            genderFilter
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
            "hashKey": { S: hashKey },
            "rangeKey": { S: rangeKey }
        }
    },
    function(err, data) {
        if (err) fn(err);
        else fn(null, {teamId1: ''});
    });
}

module.exports.getMatch = getMatch;
module.exports.updateMatch = updateMatch;
module.exports.deleteMatch = deleteMatch;
