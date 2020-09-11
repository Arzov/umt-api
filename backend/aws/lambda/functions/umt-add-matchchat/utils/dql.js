/**
 * Queries sobre AWS DynamoDB
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


/**
 * Agrega un mensaje en el chat del match
 * @param {Object} db Conexion a DynamoDB
 * @param {String} tableName Nombre de la tabla
 * @param {String} hashKey Id del equipo solicitante
 * @param {String} rangeKey Id del equipo solicitado, email del usuario y fecha del envio
 * @param {String} msg Mensaje
 * @param {Function} fn Funcion callback
 */
const addMatchChat = (db, tableName, hashKey, rangeKey, msg, fn) => {
    db.putItem({
        TableName: tableName,
        Item: {
            'hashKey': { S: hashKey },
            'rangeKey': { S: rangeKey },
            'msg': { S: msg }
        }
    }, function(err, data) {
        if (err) fn(err);
        else
            fn(null, {
                teamId1: hashKey.split('#')[1],
                teamId2: rangeKey.split('#')[1],
                userEmail: rangeKey.split('#')[2],
                sentOn: rangeKey.split('#')[3],
                msg
            });
    });
}

module.exports.addMatchChat = addMatchChat;
