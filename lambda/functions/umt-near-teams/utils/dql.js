/**
 * Queries on AWS DynamoDB
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */

const umtEnvs = require('umt-envs');

/**
 * Get near teams
 * @param {Object} db DynamoDB client
 * @param {String} tableName Team name
 * @param {String} geohash Geolocation hash
 * @param {Boolean} forJoin Indicator if want to join in a team
 * @param {String[]} ownTeams Player's teams
 * @param {String} gender Player's gender
 * @param {String} age Player's age
 * @param {String[]} genderFilter Team's gender filter
 * @param {String} ageMinFilter Min. age filter
 * @param {String} ageMaxFilter Max. age filter
 * @param {String[]} matchFilter Match types filter
 * @param {Integer} limitScan Query limit scan result
 * @param {String} nextToken Last query scanned object
 * @param {Function} fn Callback
 */
const nearTeams = (
    db,
    tableName,
    geohash,
    forJoin,
    ownTeams,
    gender,
    age,
    genderFilter,
    ageMinFilter,
    ageMaxFilter,
    matchFilter,
    limitScan,
    nextToken,
    fn
) => {
    const idx = `geohash-GSI1`;
    const keyExp = `geohash = :v1 and begins_with (hashKey, :v2)`;
    const filterExp1 = `
        contains (genderFilter, :v3)
        and (
            contains (matchFilter, :v4)
            or contains (matchFilter, :v5)
            or contains (matchFilter, :v6)
        )
        and ageMinFilter >= :v7
        and ageMaxFilter <= :v8
        and begins_with (rangeKey, :v9)
        and not contains (:v10, rangeKey)
        and searching = :v11
        and :v12 between ageMinFilter and ageMaxFilter
    `; // search from user for join in a team
    const filterExp2 = `
        genderFilter = :v3
        and (
            contains (matchFilter, :v4)
            or contains (matchFilter, :v5)
            or contains (matchFilter, :v6)
        )
        and ageMinFilter >= :v7
        and ageMaxFilter <= :v8
        and begins_with (rangeKey, :v9)
        and not contains (:v10, rangeKey)
    `; // search from team for match
    const expValues = {
        ':v1': { S: geohash },
        ':v2': { S: umtEnvs.pfx.TEAM },
        ':v3': forJoin ? { S: gender } : { SS: genderFilter },
        ':v4': { S: matchFilter[0] },
        ':v5': { S: matchFilter[1] },
        ':v6': { S: matchFilter[2] },
        ':v7': { N: ageMinFilter },
        ':v8': { N: ageMaxFilter },
        ':v9': { S: umtEnvs.pfx.METADATA },
        ':v10': { SS: ownTeams },
        ':v11': forJoin ? { BOOL: forJoin } : undefined,
        ':v12': forJoin ? { N: age } : undefined,
    };

    if (nextToken) {
        db.query(
            {
                TableName: tableName,
                IndexName: idx,
                KeyConditionExpression: keyExp,
                FilterExpression: forJoin ? filterExp1 : filterExp2,
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
                FilterExpression: forJoin ? filterExp1 : filterExp2,
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

module.exports.nearTeams = nearTeams;
