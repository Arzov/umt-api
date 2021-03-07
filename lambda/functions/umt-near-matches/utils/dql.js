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
 * @param {String[]} ownTeams Equipos ya perteneciente
 * @param {Integer} limitScan Limite de partidos a obtener para paginacion
 * @param {String} gender Sexo del jugador
 * @param {String} ageMinFilter Edad minima a filtrar
 * @param {String} ageMaxFilter Edad maxima a filtrar
 * @param {String[]} matchFilter Tipo de juego a filtrar
 * @param {String} nextToken Ultimo partido para paginacion
 * @param {Function} fn Funcion callback
 */
const nearMatches = (db, tableName, geohash, ownTeams, limitScan,
    gender, ageMinFilter, ageMaxFilter, matchFilter, nextToken, fn) => {
    const idx = `geohash-idx`
    const keyExp = `geohash = :v1 and begins_with (rangeKey, :v2)`
    const filterExp = `
        not contains (:v3, hashKey)
        and allowedPatches > :v4 and reqStat.AR = :v5 and reqStat.RR = :v5
        and contains (genderFilter, :v6)
        and ageMinFilter >= :v7 and ageMaxFilter <= :v8
        and (contains (matchFilter, :v9) or contains (matchFilter, :v10) or contains (matchFilter, :v11))
    `;
    const expValues = {
        ':v1': { S: geohash },
        ':v2': { S: umtEnvs.pfx.MATCH },
        ':v3': { SS: ownTeams },
        ':v4': { N: '0' },
        ':v5': { S: 'A' },
        ':v6': { S: gender },
        ':v7': { N: ageMinFilter },
        ':v8': { N: ageMaxFilter },
        ':v9': { S: matchFilter[0] },
        ':v10': { S: matchFilter[1] },
        ':v11': { S: matchFilter[2] }
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

module.exports.nearMatches = nearMatches;
