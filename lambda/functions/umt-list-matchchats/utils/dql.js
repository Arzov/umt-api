/**
 * Queries on AWS DynamoDB
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


// packages

const umtEnvs = require('umt-envs');


// functions

/**
 * Get messages from match's chat
 * @param   {Object}    db          DynamoDB client
 * @param   {String}    tableName   Table name
 * @param   {String}    hashKey     Applicant team id + Requested team id
 * @param   {Integer}   limitScan   Query limit scan result
 * @param   {String}    nextToken   Last query scanned object
 * @param   {Function}  fn          Callback
 */
const listMatchChats = (db, tableName, hashKey, limitScan, nextToken, fn) => {

    const keyExp = `hashKey = :v1 and begins_with (rangeKey, :v2)`;
    const expValues = {
        ':v1': { S: hashKey },
        ':v2': { S: umtEnvs.pfx.MATCH_CHAT },
    };

    db.query(
        {
            TableName                   : tableName,
            KeyConditionExpression      : keyExp,
            ExpressionAttributeValues   : expValues,
            ScanIndexForward            : false,
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

module.exports.listMatchChats = listMatchChats;
