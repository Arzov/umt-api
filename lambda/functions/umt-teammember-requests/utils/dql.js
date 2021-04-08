/**
 * Queries on AWS DynamoDB
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */

const umtEnvs = require('umt-envs');

/**
 * Get player's team requests
 * @param {Object} db DynamoDB client
 * @param {String} tableName Table name
 * @param {String} GSI1PK Email
 * @param {Integer} limitScan Query limit scan result
 * @param {String} nextToken Last query scanned object
 * @param {Function} fn Callback
 */
const teamMemberRequests = (
    db,
    tableName,
    GSI1PK,
    limitScan,
    nextToken,
    fn
) => {
    const idx = 'GSI1';
    const keyExp = `GSI1PK = :v1 and begins_with (GSI1SK, :v2)`;
    const filterExp = `reqStat.TR = :v3 or reqStat.PR = :v3`;
    const expValues = {
        ':v1': { S: GSI1PK },
        ':v2': { S: umtEnvs.pfx.TEAM },
        ':v3': { S: 'P' },
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

module.exports.teamMemberRequests = teamMemberRequests;
