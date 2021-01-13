/**
 * Queries sobre AWS DynamoDB
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


const umtEnvs = require('umt-envs');

/**
 * Obtiene solicitudes de equipos del jugador
 * @param {Object} db Conexion a DynamoDB
 * @param {String} tableName Nombre de la tabla
 * @param {String} rangeKey Email del usuario
 * @param {Integer} limitScan Limite de solicitudes a obtener para paginacion
 * @param {String} nextToken Ultima solicitud para paginacion
 * @param {Function} fn Funcion callback
 */
const teamMemberRequests = (db, tableName, rangeKey, limitScan, nextToken, fn) => {
    if (nextToken) {
        db.query({
            TableName: tableName,
            IndexName: "rangeKey-idx",
            KeyConditionExpression: "rangeKey = :v1 and begins_with (hashKey, :v2)",
            FilterExpression: "reqStat.TR = :v3 or reqStat.PR = :v3",
            ExpressionAttributeValues: {
                ":v1": { S: rangeKey },
                ":v2": { S: umtEnvs.pfx.TEAM },
                ":v3": { S: 'P' }
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
            FilterExpression: "reqStat.TR = :v3 or reqStat.PR = :v3",
            ExpressionAttributeValues: {
                ":v1": { S: rangeKey },
                ":v2": { S: umtEnvs.pfx.TEAM },
                ":v3": { S: 'P' }
            },
            Limit: limitScan
        }, function(err, data) {
            if (err) fn(err);
            else fn(null, data);
        });
    }
}

module.exports.teamMemberRequests = teamMemberRequests;
