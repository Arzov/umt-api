/**
 * Queries on AWS DynamoDB
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */

const umtUtils = require('umt-utils');

/**
 * Get match
 * @param {Object} db DynamoDB client
 * @param {String} tableName Table name
 * @param {String} hashKey Applicant team id
 * @param {String} rangeKey Requested team id
 * @param {Function} fn Callback
 */
const getMatch = (db, tableName, hashKey, rangeKey, fn) => {
    db.getItem(
        {
            TableName: tableName,
            Key: {
                hashKey: { S: hashKey },
                rangeKey: { S: rangeKey },
            },
        },
        function (err, data) {
            if (err) return fn(err);
            else if (
                Object.keys(data).length === 0 &&
                data.constructor === Object
            ) {
                fn(null, {});
            } else {
                fn(null, umtUtils.parseMatchOutput(data.Item));
            }
        }
    );
};

module.exports.getMatch = getMatch;
