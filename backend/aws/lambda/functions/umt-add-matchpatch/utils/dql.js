/**
 * Queries sobre AWS DynamoDB
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


/**
 * Obtiene un parche
 * @param {Object} db Conexion a DynamoDB
 * @param {String} tableName Nombre de la tabla
 * @param {String} hashKey Id del equipo solicitante y id del equipo solicitado
 * @param {String} rangeKey Email del parche
 * @param {Function} fn Funcion callback
 */
const getMatchPatch = (db, tableName, hashKey, rangeKey, fn) => {
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
 * Agrega un parche al match
 * @param {Object} db Conexion a DynamoDB
 * @param {String} tableName Nombre de la tabla
 * @param {String} hashKey Id del equipo solicitante y id del equipo solicitado
 * @param {String} rangeKey Email del parche
 * @param {String} joinedOn Fecha cuando se unio
 * @param {Object} reqStat Estado que indica si esta confirmado o no
 * @param {Function} fn Funcion callback
 */
const addMatchPatch = (db, tableName, hashKey, rangeKey, joinedOn, reqStat, fn) => {
    db.putItem({
        TableName: tableName,
        Item: {
            'hashKey': { S: hashKey },
            'rangeKey': { S: rangeKey },
            'joinedOn': { S: joinedOn },
            'reqStat': { M: reqStat }
        }
    }, function(err, data) {
        if (err) fn(err);
        else
            fn(null, {
                teamId1: hashKey.split('#')[1],
                teamId2: hashKey.split('#')[2],
                userEmail: rangeKey.split('#')[1],
                joinedOn,
                reqStat
            });
    });
}

module.exports.getMatchPatch = getMatchPatch;
module.exports.addMatchPatch = addMatchPatch;
