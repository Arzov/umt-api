/**
 * Queries on AWS DynamoDB
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */

const umtEnvs = require('umt-envs');

/**
 * Get active match's patches
 * @param {Object} db DynamoDB client
 * @param {String} tableName Table name
 * @param {String} hashKey Team id 1 + Team id 2
 * @param {Integer} limitScan Query limit scan result
 * @param {String} nextToken Last query scanned object
 * @param {Function} fn Callback
 */
const listMatchPatches = (db, tableName, hashKey, limitScan, nextToken, fn) => {
    const keyExp = `hashKey = :v1 and begins_with (rangeKey, :v2)`;
    const filterExp = `reqStat.MR = :v3 and reqStat.PR = :v3`;
    const expValues = {
        ':v1': { S: hashKey },
        ':v2': { S: umtEnvs.pfx.PATCH },
        ':v3': { S: 'A' },
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

module.exports.listMatchPatches = listMatchPatches;
