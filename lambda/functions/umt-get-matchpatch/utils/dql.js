/**
 * Queries on AWS DynamoDB
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */

/**
 * Get match patch
 * @param {Object} db DynamoDB client
 * @param {String} tableName Table name
 * @param {String} hashKey Applicant team id + Requested team id
 * @param {String} rangeKey User email
 * @param {Function} fn Callback
 */
const getMatchPatch = (db, tableName, hashKey, rangeKey, fn) => {
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
                fn(null, {
                    teamId1: data.Item.hashKey.S.split('#')[1],
                    teamId2: data.Item.hashKey.S.split('#')[2],
                    email: data.Item.rangeKey.S.split('#')[1],
                    reqStat: JSON.stringify(data.Item.reqStat.M),
                    joinedOn: data.Item.joinedOn.S,
                    expireOn: data.Item.expireOn.S,
                });
            }
        }
    );
};

module.exports.getMatchPatch = getMatchPatch;
