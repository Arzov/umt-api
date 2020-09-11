/**
 * Queries sobre AWS DynamoDB
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


/**
 * Agrega un parche al match
 * @param {Object} db Conexion a DynamoDB
 * @param {String} tableName Nombre de la tabla
 * @param {String} hashKey Id del equipo solicitante
 * @param {String} rangeKey Id del equipo solicitado y el email del parche
 * @param {String} joinedOn Fecha cuando se unio
 * @param {Object} status Estado que indica si esta confirmado o no
 * @param {Function} fn Funcion callback
 */
const addMatchPatch = (db, tableName, hashKey, rangeKey, joinedOn, status, fn) => {
    db.putItem({
        TableName: tableName,
        Item: {
            'hashKey': { S: hashKey },
            'rangeKey': { S: rangeKey },
            'joinedOn': { S: joinedOn },
            'status': { M: status }
        }
    }, function(err, data) {
        if (err) fn(err);
        else
            fn(null, {
                teamId1: hashKey.split('#')[1],
                teamId2: rangeKey.split('#')[1],
                userEmail: rangeKey.split('#')[2],
                joinedOn,
                status
            });
    });
}

module.exports.addMatchPatch = addMatchPatch;
