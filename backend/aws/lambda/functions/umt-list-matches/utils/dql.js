/**
 * Queries sobre AWS DynamoDB
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


const umtEnvs = require('umt-envs');

/**
 * Obtiene partidos del equipo como organizador
 * @param {Object} db Conexion a DynamoDB
 * @param {String} tableName Nombre de la tabla
 * @param {String} hashKey Id del equipo
 * @param {Integer} limitScan Limite de partidos a obtener para paginacion
 * @param {String} nextToken Ultimo partido para paginacion
 * @param {Function} fn Funcion callback
 */
const listOwnerMatches = (db, tableName, hashKey, limitScan, nextToken, fn) => {
    if (nextToken) {
        db.query({
            TableName: tableName,
            KeyConditionExpression: "hashKey = :v1 and begins_with (rangeKey, :v2)",
            FilterExpression: "reqStat.AR = :v3 and reqStat.RR = :v3",
            ExpressionAttributeValues: {
                ":v1": { S: hashKey },
                ":v2": { S: umtEnvs.pfx.MATCH },
                ":v3": { S: 'A' }
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
            KeyConditionExpression: "hashKey = :v1 and begins_with (rangeKey, :v2)",
            FilterExpression: "reqStat.AR = :v3 and reqStat.RR = :v3",
            ExpressionAttributeValues: {
                ":v1": { S: hashKey },
                ":v2": { S: umtEnvs.pfx.MATCH },
                ":v3": { S: 'A' }
            },
            Limit: limitScan
        }, function(err, data) {
            if (err) fn(err);
            else fn(null, data);
        });
    }
}

/**
 * Obtiene partidos del equipo como invitado
 * @param {Object} db Conexion a DynamoDB
 * @param {String} tableName Nombre de la tabla
 * @param {String} rangeKey Id del equipo
 * @param {Integer} limitScan Limite de partidos a obtener para paginacion
 * @param {String} nextToken Ultimo partido para paginacion
 * @param {Function} fn Funcion callback
 */
const listGuestMatches = (db, tableName, rangeKey, limitScan, nextToken, fn) => {
    if (nextToken) {
        db.query({
            TableName: tableName,
            IndexName: "rangeKey-idx",
            KeyConditionExpression: "rangeKey = :v1 and begins_with (hashKey, :v2)",
            FilterExpression: "reqStat.AR = :v3 and reqStat.RR = :v3",
            ExpressionAttributeValues: {
                ":v1": { S: rangeKey },
                ":v2": { S: umtEnvs.pfx.MATCH },
                ":v3": { S: 'A' }
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
            FilterExpression: "reqStat.AR = :v3 and reqStat.RR = :v3",
            ExpressionAttributeValues: {
                ":v1": { S: rangeKey },
                ":v2": { S: umtEnvs.pfx.MATCH },
                ":v3": { S: 'A' }
            },
            Limit: limitScan
        }, function(err, data) {
            if (err) fn(err);
            else fn(null, data);
        });
    }
}

module.exports.listOwnerMatches = listOwnerMatches;
module.exports.listGuestMatches = listGuestMatches;