/**
 * Queries on AWS DynamoDB
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


// packages

const umtEnvs = require('umt-envs');


// functions

/**
 * Get near matches
 * @param   {Object}    db              DynamoDB client
 * @param   {String}    tableName       Table name
 * @param   {String}    geohash         Geolocation hash
 * @param   {String[]}  ownTeams        Player's teams
 * @param   {String}    gender          Player gender
 * @param   {String}    age             Player age
 * @param   {String}    ageMinFilter    Min. age filter
 * @param   {String}    ageMaxFilter    Max. age filter
 * @param   {String[]}  matchFilter     Match types filter
 * @param   {String}    currDate        Current date
 * @param   {Integer}   limitScan       Query limit scan result
 * @param   {String}    nextToken       Last query scanned object
 * @param   {Function}  fn              Callback
 */
const nearMatches = (
    db,
    tableName,
    geohash,
    ownTeams,
    gender,
    age,
    ageMinFilter,
    ageMaxFilter,
    matchFilter,
    currDate,
    limitScan,
    nextToken,
    fn
) => {

    const idx = `geohash-GSI1`;
    const keyExp = `geohash = :v1 and begins_with (hashKey, :v2)`;

    const filterExp = `
        begins_with (rangeKey, :v3)
        and not contains (:v4, rangeKey)
        and not contains (:v4, GSI1SK)
        and patches.CP < patches.NP
        and patches.NP > :v5
        and reqStat.AR = :v6
        and reqStat.RR = :v6
        and contains (genderFilter, :v7)
        and ageMinFilter >= :v8
        and ageMaxFilter <= :v9
        and :v10 between ageMinFilter and ageMaxFilter
        and (
            contains (matchFilter, :v11)
            or contains (matchFilter, :v12)
            or contains (matchFilter, :v13)
        )
        and schedule >= :v14
    `;

    const expValues = {
        ':v1'   : { S   : geohash },
        ':v2'   : { S   : umtEnvs.pfx.TEAM },
        ':v3'   : { S   : umtEnvs.pfx.MATCH },
        ':v4'   : { SS  : ownTeams },
        ':v5'   : { N   : '0' },
        ':v6'   : { S   : 'A' },
        ':v7'   : { S   : gender },
        ':v8'   : { N   : ageMinFilter },
        ':v9'   : { N   : ageMaxFilter },
        ':v10'  : { N   : age },
        ':v11'  : { S   : matchFilter[0] },
        ':v12'  : { S   : matchFilter[1] },
        ':v13'  : { S   : matchFilter[2] },
        ':v14'  : { S   : currDate },
    };

    db.query(
        {
            TableName: tableName,
            IndexName: idx,
            KeyConditionExpression: keyExp,
            FilterExpression: filterExp,
            ExpressionAttributeValues: expValues,
            ExclusiveStartKey: nextToken ? JSON.parse(nextToken) : undefined,
            Limit: limitScan,
        },

        function (err, data) {
            if (err) fn(err);
            else fn(null, data);
        }
    );
};


// export modules

module.exports.nearMatches = nearMatches;
