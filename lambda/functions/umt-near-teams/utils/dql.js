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
 * @param {Boolean} forJoin Indica si se busca equipos disponibles para unirse
 * @param {Integer} limitScan Limite de equipos a obtener para paginacion
 * @param {String[]} ownTeams Equipos ya perteneciente
 * @param {String} gender Sexo a del usuario
 * @param {String[]} genderFilter Sexo a filtrar
 * @param {String} ageMinFilter Edad minima a filtrar
 * @param {String} ageMaxFilter Edad maxima a filtrar
 * @param {String[]} matchFilter Tipo de juego a filtrar
 * @param {String} nextToken Ultimo equipo para paginacion
 * @param {Function} fn Funcion callback
 */
const nearTeams = (db, tableName, geohash, forJoin, limitScan, ownTeams, gender,
    genderFilter, ageMinFilter, ageMaxFilter, matchFilter, nextToken, fn) => {
    const idx = `geohash-idx`
    const keyExp = `geohash = :v1 and begins_with (rangeKey, :v2)`
    const filterExp1 = `
        contains (genderFilter, :v3)
        and (contains (matchFilter, :v4) or contains (matchFilter, :v5) or contains (matchFilter, :v6))
        and ageMinFilter >= :v7 and ageMaxFilter <= :v8 and not contains (:v9, hashKey)
        and searchingPlayers = :v10
    `;
    const filterExp2 = `
        genderFilter = :v3
        and (contains (matchFilter, :v4) or contains (matchFilter, :v5) or contains (matchFilter, :v6))
        and ageMinFilter >= :v7 and ageMaxFilter <= :v8 and not contains (:v9, hashKey)
    `;
    const expValues = {
        ':v1': { S: geohash },
        ':v2': { S: umtEnvs.pfx.TEAM },
        ':v3': forJoin ? { S: gender } : { SS: genderFilter },
        ':v4': { S: matchFilter[0] },
        ':v5': { S: matchFilter[1] },
        ':v6': { S: matchFilter[2] },
        ':v7': { N: ageMinFilter },
        ':v8': { N: ageMaxFilter },
        ':v9': { SS: ownTeams },
        ':v10': forJoin ? { BOOL: forJoin } : undefined
    };

    if (nextToken) {
        db.query({
            TableName: tableName,
            IndexName: idx,
            KeyConditionExpression: keyExp,
            FilterExpression: forJoin ? filterExp1 : filterExp2,
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
            FilterExpression: forJoin ? filterExp1 : filterExp2,
            ExpressionAttributeValues: expValues,
            Limit: limitScan
        }, function(err, data) {
            if (err) fn(err);
            else fn(null, data);
        });
    }
}

module.exports.nearTeams = nearTeams;
