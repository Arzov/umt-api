/**
 * Queries sobre AWS DynamoDB
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


const umtEnvs = require('umt-envs');

/**
 * Obtiene equipos cercanos
 * @param {Object} db Conexion a DynamoDB
 * @param {String} tableName Nombre de la tabla
 * @param {String} geohash Hash de geolocalizacion
 * @param {Integer} limitScan Limite de equipos a obtener para paginacion
 * @param {String} nextToken Ultimo equipo para paginacion
 * @param {Function} fn Funcion callback
 */
const nearTeams = (db, tableName, geohash, limitScan, nextToken, fn) => {
    if (nextToken) {
        db.query({
            TableName: tableName,
            IndexName: "geohash-idx",
            KeyConditionExpression: "geohash = :v1 and begins_with (rangeKey, :v2)",
            ExpressionAttributeValues: {
                ":v1": { S: geohash },
                ":v2": { S: umtEnvs.pfx.TEAM }
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
            ExpressionAttributeValues: {
                ":v1": { S: geohash },
                ":v2": { S: umtEnvs.pfx.TEAM }
            },
            Limit: limitScan
        }, function(err, data) {
            if (err) fn(err);
            else fn(null, data);
        });
    }
}

module.exports.nearTeams = nearTeams;
