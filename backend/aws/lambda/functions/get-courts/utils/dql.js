/**
 * Queries sobre AWS DynamoDB
 * @version 1.0.0
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


/**
 * Obtiene canchas cercanas a la gelocalización del usuario
 * @param {Object} db Conexion a DynamoDB
 * @param {String} tableName Nombre de la tabla
 * @param {String} hashKey Hash de geolocalización
 * @param {String} matchType Tipo de cancha a buscar
 * @param {Integer} limitScan Límite de canchas a obtener para paginación
 * @param {String} nextToken Ultima cancha para paginación
 * @param {Function} fn Función callback
 */
const getCourts = (db, tableName, hashKey, matchType, limitScan, nextToken, fn) => {
    if (nextToken) {
        db.query({
            TableName: tableName,
            KeyConditionExpression: "hashKey = :v1",
            FilterExpression: "contains (matchType, :v2)",
            ExpressionAttributeValues: {
                ":v1": { S: hashKey },
                ":v2": { S: matchType }
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
            FilterExpression: "contains (matchType, :v2)",
            ExpressionAttributeValues: {
                ":v1": { S: hashKey },
                ":v2": { S: matchType }
            },
            Limit: limitScan
        }, function(err, data) {
            if (err) fn(err);
            else fn(null, data);
        });
    }
}

module.exports.getCourts = getCourts;
