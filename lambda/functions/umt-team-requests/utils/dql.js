/**
 * Queries sobre AWS DynamoDB
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


const umtEnvs = require('umt-envs');

/**
 * Obtiene solicitudes de jugadores del equipo
 * @param {Object} db Conexion a DynamoDB
 * @param {String} tableName Nombre de la tabla
 * @param {String} hashKey Id del equipo
 * @param {Integer} limitScan Limite de solicitudes a obtener para paginacion
 * @param {String} nextToken Ultima solicitud para paginacion
 * @param {Function} fn Funcion callback
 */
const teamRequests = (db, tableName, hashKey, limitScan, nextToken, fn) => {
    const keyExp = `hashKey = :v1 and begins_with (rangeKey, :v2)`;
    const filterExp = `reqStat.TR = :v3 or reqStat.PR = :v3`;
    const expValues = {
        ':v1': { S: hashKey },
        ':v2': { S: umtEnvs.pfx.MEM },
        ':v3': { S: 'P' }
    };

    if (nextToken) {
        db.query({
            TableName: tableName,
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

module.exports.teamRequests = teamRequests;
