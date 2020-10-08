/**
 * Queries sobre AWS DynamoDB
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


const umtEnvs = require('umt-envs');

/**
 * Obtiene partidos cercanos
 * @param {Object} db Conexion a DynamoDB
 * @param {String} tableName Nombre de la tabla
 * @param {String} geohash Hash de geolocalizacion
 * @param {Integer} limitScan Limite de partidos a obtener para paginacion
 * @param {String} nextToken Ultimo partido para paginacion
 * @param {Function} fn Funcion callback
 */
const nearMatches = (db, tableName, geohash, limitScan, nextToken, fn) => {
    if (nextToken) {
        db.query({
            TableName: tableName,
            IndexName: "geohash-idx",
            KeyConditionExpression: "geohash = :v1 and begins_with (rangeKey, :v2)",
            FilterExpression: "allowedPatches > :v3",
            ExpressionAttributeValues: {
                ":v1": { S: geohash },
                ":v2": { S: umtEnvs.pfx.MATCH },
                ":v3": { N: '0' }
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
            IndexName: "geohash-idx",
            KeyConditionExpression: "geohash = :v1 and begins_with (rangeKey, :v2)",
            FilterExpression: "allowedPatches > :v3",
            ExpressionAttributeValues: {
                ":v1": { S: geohash },
                ":v2": { S: umtEnvs.pfx.MATCH },
                ":v3": { N: '0' }
            },
            Limit: limitScan
        }, function(err, data) {
            if (err) fn(err);
            else fn(null, data);
        });
    }
}

module.exports.nearMatches = nearMatches;
