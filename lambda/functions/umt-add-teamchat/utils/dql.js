/**
 * Queries sobre AWS DynamoDB
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


/**
 * Agrega un mensaje en el chat del equipo
 * @param {Object} db Conexion a DynamoDB
 * @param {String} tableName Nombre de la tabla
 * @param {String} hashKey Id del equipo
 * @param {String} rangeKey Fecha del envio y email del usuario
 * @param {String} msg Mensaje
 * @param {Function} fn Funcion callback
 */
const addTeamChat = (db, tableName, hashKey, rangeKey, msg, fn) => {
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
                teamId: hashKey.split('#')[1],
                userEmail: rangeKey.split('#')[2],
                sentOn: rangeKey.split('#')[1],
                msg
            });
    });
}

module.exports.addTeamChat = addTeamChat;
