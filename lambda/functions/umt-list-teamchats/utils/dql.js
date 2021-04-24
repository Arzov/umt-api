/**
 * Queries on AWS DynamoDB
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */

const umtEnvs = require('umt-envs');

/**
 * Get messages from team's chat
 * @param {Object} db DynamoDB client
 * @param {String} tableName Table name
 * @param {String} hashKey Team id
 * @param {Integer} limitScan Query limit scan result
 * @param {String} nextToken Last query scanned object
 * @param {Function} fn Callback
 */
const listTeamChats = (db, tableName, hashKey, limitScan, nextToken, fn) => {
    const keyExp = `hashKey = :v1 and begins_with (rangeKey, :v2)`;
    const expValues = {
        ':v1': { S: hashKey },
        ':v2': { S: umtEnvs.pfx.TEAM_CHAT },
    };

    db.query(
        {
            TableName: tableName,
            KeyConditionExpression: keyExp,
            ExpressionAttributeValues: expValues,
            ScanIndexForward: false,
            ExclusiveStartKey: nextToken ? JSON.parse(nextToken) : undefined,
            Limit: limitScan,
        },
        function (err, data) {
            if (err) fn(err);
            else fn(null, data);
        }
    );
};

module.exports.listTeamChats = listTeamChats;
