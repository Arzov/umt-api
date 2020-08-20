/**
 * Queries sobre AWS DynamoDB
 * @version 1.0.0
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


/**
 * Obtiene información del match
 * @param {Object} db Conexion a DynamoDB
 * @param {String} tableName Nombre de la tabla
 * @param {String} hashKey Email del usuario
 * @param {String} rangeKey Email del rival
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
 * Actualiza información del match
 * @param {Object} db Conexion a DynamoDB
 * @param {String} tableName Nombre de la tabla
 * @param {String} hashKey Email del usuario
 * @param {String} rangeKey Email del rival
 * @param {String} matchStatus Estado del match
 * @param {Function} fn Función callback
 */
function queryUpdateMatch(db, tableName, hashKey, rangeKey, matchStatus, fn) {
    db.updateItem({
        TableName: tableName,
        Key: {
            "hashKey": { S: hashKey },
            "rangeKey": { S: rangeKey }
        },
        UpdateExpression: "set matchStatus = :v1",
        ExpressionAttributeValues: {
            ":v1": { S: matchStatus }
        }
    },
    function(err, data) {
        if (err) fn(err);
        else fn(null, data);
    });
}

/**
 * Actualiza estado del match para el usuario y su rival
 * @param {Object} db Conexion a DynamoDB
 * @param {String} tableName Nombre de la tabla
 * @param {String} hashKey Email del usuario
 * @param {String} rangeKey Email del rival
 * @param {String} creatorStatus Estado del match del usuario
 * @param {String} adversaryStatus Estado del match del rival
 * @param {Boolean} isCreator Identifica si el rival es el creador del match o no
 * @param {Function} callback Función callback
 */
const updateMatch = (db, tableName, hashKey, rangeKey, creatorStatus, adversaryStatus,
	isCreator, callback) => {
    // Se actualiza primero el match para el creador
    queryUpdateMatch(db, tableName, hashKey, rangeKey, creatorStatus, function(err, data) {
        if (err) callback(err);
        else {
            // Se actualiza el match para el rival o adversario
            queryUpdateMatch(db, tableName, rangeKey, hashKey, adversaryStatus, function(err, data) {
                if (err) callback(err);
                else {
                    /**
					 * Devolver el email del rival segun corresponda
					 * para notificar en la suscripcion de AWS AppSync
					 */ 
                    if (isCreator) callback(null, { rangeKey });
                    else callback(null, { rangeKey: hashKey });
                }
            });
        }
    });
}

module.exports.getMatch = getMatch;
module.exports.updateMatch = updateMatch;
