/**
 * Queries on AWS DynamoDB
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


// packages

const umtEnvs = require('umt-envs');


// functions

/**
 * Get team requests from/to players
 * @param   {Object}    db          DynamoDB client
 * @param   {String}    tableName   Table name
 * @param   {String}    hashKey     Team id
 * @param   {Integer}   limitScan   Query limit scan result
 * @param   {String}    nextToken   Last query scanned object
 * @param   {Function}  fn          Callback
 */
const teamRequests = (db, tableName, hashKey, limitScan, nextToken, fn) => {

    const keyExp = `hashKey = :v1 and begins_with (rangeKey, :v2)`;
    const filterExp = `reqStat.TR = :v3 or reqStat.PR = :v3`;
    const expValues = {
        ':v1': { S: hashKey },
        ':v2': { S: umtEnvs.pfx.TEAM_MEMBER },
        ':v3': { S: 'P' },
    };

    db.query(
        {
            TableName                   : tableName,
            KeyConditionExpression      : keyExp,
            FilterExpression            : filterExp,
            ExpressionAttributeValues   : expValues,
            ExclusiveStartKey           : nextToken ? JSON.parse(nextToken) : undefined,
            Limit                       : limitScan,
        },

        function (err, data) {
            if (err) fn(err);
            else fn(null, data);
        }
    );
};


// export modules

module.exports.teamRequests = teamRequests;
