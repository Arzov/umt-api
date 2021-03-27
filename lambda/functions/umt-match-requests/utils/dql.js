/**
 * Queries on AWS DynamoDB
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */

const umtEnvs = require('umt-envs');

/**
 * Get team requests like owner
 * @param {Object} db DynamoDB client
 * @param {String} tableName Table name
 * @param {String} hashKey Team id
 * @param {Integer} limitScan Query limit scan result
 * @param {String} nextToken Last query scanned object
 * @param {Function} fn Callback
 */
const matchOwnerRequests = (
    db,
    tableName,
    hashKey,
    limitScan,
    nextToken,
    fn
) => {
    const keyExp = `hashKey = :v1 and begins_with (rangeKey, :v2)`;
    const filterExp = `reqStat.AR = :v3 or reqStat.RR = :v3`;
    const expValues = {
        ':v1': { S: hashKey },
        ':v2': { S: umtEnvs.pfx.MATCH },
        ':v3': { S: 'P' },
    };

    if (nextToken) {
        db.query(
            {
                TableName: tableName,
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

/**
 * Get team requests like guest
 * @param {Object} db DynamoDB client
 * @param {String} tableName Table name
 * @param {String} rangeKey Team id
 * @param {Integer} limitScan Query limit scan result
 * @param {String} nextToken Last query scanned object
 * @param {Function} fn Callback
 */
const matchGuestRequests = (
    db,
    tableName,
    rangeKey,
    limitScan,
    nextToken,
    fn
) => {
    const idx = 'rangeKey-idx';
    const keyExp = `rangeKey = :v1 and begins_with (hashKey, :v2)`;
    const filterExp = `reqStat.AR = :v3 or reqStat.RR = :v3`;
    const expValues = {
        ':v1': { S: rangeKey },
        ':v2': { S: umtEnvs.pfx.MATCH },
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

module.exports.matchOwnerRequests = matchOwnerRequests;
module.exports.matchGuestRequests = matchGuestRequests;
