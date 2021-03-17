/**
 * Queries on AWS DynamoDB
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */

const umtEnvs = require('umt-envs');

/**
 * Get near matches
 * @param {Object} db DynamoDB client
 * @param {String} tableName Table name
 * @param {String} geohash Geolocation hash
 * @param {String[]} ownTeams Player's teams
 * @param {String} gender Player gender
 * @param {String} ageMinFilter Min. age filter
 * @param {String} ageMaxFilter Max. age filter
 * @param {String[]} matchFilter Match types filter
 * @param {Integer} limitScan Query limit scan result
 * @param {String} nextToken Last query scanned object
 * @param {Function} fn Callback
 */
const nearMatches = (
    db,
    tableName,
    geohash,
    ownTeams,
    gender,
    ageMinFilter,
    ageMaxFilter,
    matchFilter,
    limitScan,
    nextToken,
    fn
) => {
    const idx = `geohash-idx`;
    const keyExp = `geohash = :v1 and begins_with (rangeKey, :v2)`;
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
        ':v11': { S: matchFilter[2] },
    };

    if (nextToken) {
        db.query(
            {
                TableName: tableName,
                IndexName: idx,
                KeyConditionExpression: keyExp,
                FilterExpression: filterExp,
                ExpressionAttributeValues: expValues,
                ExclusiveStartKey: JSON.parse(nextToken),
                Limit: limitScan,
            },
            function (err, data) {
                if (err) fn(err);
                else fn(null, data);
            }
        );
    } else {
        db.query(
            {
                TableName: tableName,
                IndexName: idx,
                KeyConditionExpression: keyExp,
                FilterExpression: filterExp,
                ExpressionAttributeValues: expValues,
                Limit: limitScan,
            },
            function (err, data) {
                if (err) fn(err);
                else fn(null, data);
            }
        );
    }
};

module.exports.nearMatches = nearMatches;
