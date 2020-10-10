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
 * Crea un match entre equipos
 * @param {Object} db Conexion a DynamoDB
 * @param {String} tableName Nombre de la tabla
 * @param {String} hashKey Id del equipo solicitante
 * @param {String} rangeKey Id del equipo solicitado
 * @param {String} createdOn Fecha de creacion
 * @param {String} expireOn Fecha de expiracion
 * @param {String} allowedPatches Numero de parches permitidos
 * @param {String[]} positions Posiciones requeridas para parchar
 * @param {String[]} matchTypes Tipo de juego del partido
 * @param {Object} schedule Horario y fecha del encuentro
 * @param {Object} status Estado de la solicitud
 * @param {String} geohash Hash de geolocalizacion
 * @param {String} stadiumGeohash Hash de geolocalizacion del club deportivo
 * @param {String} stadiumId Id del club deportivo donde se jugara
 * @param {String} courtId Id de la cancha donde se jugara el partido
 * @param {String[]} genderFilter Filtro de sexo del partido
 * @param {Function} fn Funcion callback
 */
const addMatch = (db, tableName, hashKey, rangeKey, createdOn, expireOn, allowedPatches,
    positions, matchTypes, schedule, status, geohash, stadiumGeohash, stadiumId, courtId, genderFilter,
    fn) => {
    db.putItem({
        TableName: tableName,
        Item: {
            'hashKey': { S: hashKey },
            'rangeKey': { S: rangeKey },
            'createdOn': { S: createdOn },
            'expireOn': { S: expireOn },
            'allowedPatches': { N: allowedPatches },
            'positions': { SS: positions },
            'matchTypes': { SS: matchTypes },
            'schedule': { M: schedule },
            'status': { M: status },
            'geohash': { S: geohash },
            'stadiumGeohash': { S: stadiumGeohash },
            'stadiumId': { S: stadiumId },
            'courtId': { N: courtId },
            'genderFilter': { SS: genderFilter }
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
                matchTypes,
                schedule,
                status,
                geohash,
                stadiumGeohash,
                stadiumId,
                courtId,
                genderFilter
            });
    });
}

module.exports.getMatch = getMatch;
module.exports.addMatch = addMatch;
