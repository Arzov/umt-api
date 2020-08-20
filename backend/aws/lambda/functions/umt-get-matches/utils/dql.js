/**
 * Queries sobre AWS DynamoDB
 * @version 1.0.0
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


/**
 * Obtiene matches activos o pendientes del usuario
 * @param {Object} db Conexion a DynamoDB
 * @param {String} tableName Nombre de la tabla
 * @param {String} hashKey Email del usuario
 * @param {String} currentDate Fecha actual para descartar matches expirados
 * @param {Integer} limitScan Límite de matches a obtener para paginación
 * @param {String} nextToken Último match para paginación
 * @param {Function} fn Función callback
 */
const getMatches = (db, tableName, hashKey, currentDate, limitScan, nextToken, fn) => {
    if (nextToken) {
        db.query({
            TableName: tableName,
            KeyConditionExpression: "hashKey = :v1",
            FilterExpression: "expireAt >= :v2 and matchStatus <> :v3",
            ExpressionAttributeValues: {
                ":v1": { S: hashKey },
                ":v2": { S: currentDate },
                ":v3": { S: 'C' }
            },
            ExclusiveStartKey: JSON.parse(nextToken),
            Limit: limitScan
        }, function(err, data) {
            if (err) fn(err);
            else fn(null, data);
        });
    }
    else {
        db.query({
            TableName: tableName,
            KeyConditionExpression: "hashKey = :v1",
            FilterExpression: "expireAt >= :v2 and matchStatus <> :v3",
            ExpressionAttributeValues: {
                ":v1": { S: hashKey },
                ":v2": { S: currentDate },
                ":v3": { S: 'C' }
            },
            Limit: limitScan
        }, function(err, data) {
            if (err) fn(err);
            else fn(null, data);
        });
    }
}

module.exports.getMatches = getMatches;
