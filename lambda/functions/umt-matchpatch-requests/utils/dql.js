/**
 * Queries sobre AWS DynamoDB
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


const umtEnvs = require('umt-envs');

/**
 * Obtiene solicitudes de equipos para parchar
 * @param {Object} db Conexion a DynamoDB
 * @param {String} tableName Nombre de la tabla
 * @param {String} rangeKey Email del usuario
 * @param {Integer} limitScan Limite de solicitudes a obtener para paginacion
 * @param {String} nextToken Ultima solicitud para paginacion
 * @param {Function} fn Funcion callback
 */
const matchPatchRequests = (db, tableName, rangeKey, limitScan, nextToken, fn) => {
    const idx = 'rangeKey-idx';
    const keyExp = `rangeKey = :v1 and begins_with (hashKey, :v2)`;
    const filterExp = `reqStat.MR = :v3 or reqStat.PR = :v3`;
    const expValues = {
        ':v1': { S: rangeKey },
        ':v2': { S: umtEnvs.pfx.MATCH },
        ':v3': { S: 'P' }
    };

    if (nextToken) {
        db.query({
            TableName: tableName,
            IndexName: idx,
            KeyConditionExpression: keyExp,
            FilterExpression: filterExp,
            ExpressionAttributeValues: expValues,
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
            IndexName: idx,
            KeyConditionExpression: keyExp,
            FilterExpression: filterExp,
            ExpressionAttributeValues: expValues,
            Limit: limitScan
        }, function(err, data) {
            if (err) fn(err);
            else fn(null, data);
        });
    }
}

module.exports.matchPatchRequests = matchPatchRequests;
