/**
 * Queries sobre AWS DynamoDB
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


const umtEnvs = require('umt-envs');

/**
 * Obtiene equipos al que pertenece el usuario
 * @param {Object} db Conexion a DynamoDB
 * @param {String} tableName Nombre de la tabla
 * @param {String} rangeKey Email
 * @param {Integer} limitScan Limite de equipos a obtener para paginacion
 * @param {String} nextToken Ultimo equipo para paginacion
 * @param {Function} fn Funcion callback
 */
const listTeams = (db, tableName, rangeKey, limitScan, nextToken, fn) => {
    if (nextToken) {
        db.query({
            TableName: tableName,
            IndexName: "rangeKey-idx",
            KeyConditionExpression: "rangeKey = :v1 and begins_with (hashKey, :v2)",
            ExpressionAttributeValues: {
                ":v1": { S: rangeKey },
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
            IndexName: "rangeKey-idx",
            KeyConditionExpression: "rangeKey = :v1 and begins_with (hashKey, :v2)",
            ExpressionAttributeValues: {
                ":v1": { S: rangeKey },
                ":v2": { S: umtEnvs.pfx.TEAM }
            },
            Limit: limitScan
        }, function(err, data) {
            if (err) fn(err);
            else fn(null, data);
        });
    }
}

module.exports.listTeams = listTeams;
