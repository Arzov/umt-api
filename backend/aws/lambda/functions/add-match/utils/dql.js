/**
 * Queries sobre AWS DynamoDB
 * @version 1.0.0
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


/**
 * Obtiene información de un match
 * @param {Object} db Conexion a DynamoDB
 * @param {String} tableName Nombre de la tabla
 * @param {String} hashKey Email del usuario creador
 * @param {String} rangeKey Email del usuario rival
 * @param {Function} fn Función callback
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
 * Agrega un match
 * @param {Object} db Conexion a DynamoDB
 * @param {String} tableName Nombre de la tabla
 * @param {String} hashKey Email del usuario creador
 * @param {String} rangeKey Email del usuario rival
 * @param {String} matchId Id del match (email creador + '#' + email invitado)
 * @param {String} geohash Hash de geolocalización
 * @param {String} adversaryName Nombre del adversario
 * @param {String} adversaryPicture URL de la imagen de perfil del adversario
 * @param {String} createdAt Fecha de cración del match
 * @param {String} expireAt Fecha de expiración del match
 * @param {String} matchStatus Estado del match para el primer usuario
 * @param {String} matchFilter Tipo de match (5v5, 7v7, 11v11) según el creador del match
 * @param {String} genderFilter Filtro de sexo del creador del match
 * @param {String} ageMinFilter Filtro de edad mínima del creador del match
 * @param {String} ageMaxFilter Filtro de edad máxima del creador del match
 * @param {Function} fn Función callback
 */
const addMatch = (db, tableName, hashKey, rangeKey, matchId, geohash, adversaryName,
    adversaryPicture, createdAt, expireAt, matchStatus, matchFilter, genderFilter, ageMinFilter,
    ageMaxFilter, fn) => {
    db.putItem({
        TableName: tableName,
        Item: {
            "hashKey": { S: hashKey },
            "rangeKey": { S: rangeKey },
            "geohash": { S: geohash },
            "adversaryName": { S: adversaryName },
            "adversaryPicture": { S: adversaryPicture },
            "matchId": { S: matchId },
            "createdAt": { S: createdAt },
            "expireAt": { S: expireAt },
            "matchStatus": { S: matchStatus },
            "matchFilter": { S: matchFilter },
            "genderFilter": { S: genderFilter },
            "ageMinFilter": { N: ageMinFilter },
            "ageMaxFilter": { N: ageMaxFilter }
        }
    }, function(err, data) {
        if (err) fn(err);
        else fn(null, data);
    });
}

/**
 * Crea un match para el usuario creador y rival
 * @param {Object} db Conexion a DynamoDB
 * @param {String} tableName Nombre de la tabla
 * @param {String} hashKey Email del usuario creador
 * @param {String} rangeKey Email del usuario rival
 * @param {String} matchId Id del match (email creador + '#' + email invitado)
 * @param {String} geohash Hash de geolocalización
 * @param {String} adversaryName Nombre del adversario
 * @param {String} adversaryPicture URL de la imagen de perfil del adversario
 * @param {String} createdAt Fecha de cración del match
 * @param {String} expireAt Fecha de expiración del match
 * @param {String} matchStatus Estado del match para el primer usuario
 * @param {String} matchFilter Tipo de match (5v5, 7v7, 11v11) según el creador del match
 * @param {String} genderFilter Filtro de sexo del creador del match
 * @param {String} ageMinFilter Filtro de edad mínima del creador del match
 * @param {String} ageMaxFilter Filtro de edad máxima del creador del match
 * @param {Function} fn Función callback
 */
const createMatch = (db, tableName, hashKey, rangeKey, matchId, geohash, creatorName, creatorPicture,
    adversaryName, adversaryPicture, createdAt, expireAt, matchStatus, matchFilter, genderFilter,
    ageMinFilter, ageMaxFilter, callback) => {
    // Se crea primero el match para el creador
    addMatch(db, tableName, hashKey, rangeKey, matchId, geohash, adversaryName, adversaryPicture,
        createdAt, expireAt, matchStatus, matchFilter, genderFilter, ageMinFilter,
        ageMaxFilter, function(err, data) {
        if (err) callback(err);
        else {
            // Se crea el match para el invitado o adversario
            addMatch(db, tableName, rangeKey, hashKey, matchId, geohash, creatorName, creatorPicture,
                createdAt, expireAt, matchStatus, matchFilter, genderFilter, ageMinFilter,
                ageMaxFilter, function(err, data) {
                if (err) callback(err);
                else callback(null, { matchId });
            });
        }
    });
}

module.exports.getMatch = getMatch;
module.exports.createMatch = createMatch;
