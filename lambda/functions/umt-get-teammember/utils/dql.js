/**
 * Queries on AWS DynamoDB
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */

const umtUtils = require('umt-utils');

/**
 * Get a team member
 * @param {Object} db DynamoDB client
 * @param {String} tableName Table name
 * @param {String} hashKey Team id
 * @param {String} rangeKey User email
 * @param {Function} fn Callback
 */
const getTeamMember = (db, tableName, hashKey, rangeKey, fn) => {
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
            else if (umtUtils.isObjectEmpty(data)) {
                fn(null, {});
            } else {
                fn(null, {
                    teamId: data.Item.hashKey.S.split('#')[1],
                    email: data.Item.rangeKey.S.split('#')[1],
                    position: JSON.stringify(data.Item.position.M),
                    joinedOn: data.Item.joinedOn.S,
                    role: data.Item.role.SS,
                    reqStat: JSON.stringify(data.Item.reqStat.M),
                    number: data.Item.number.N,
                });
            }
        }
    );
};

module.exports.getTeamMember = getTeamMember;
