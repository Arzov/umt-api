/**
 * Queries on AWS DynamoDB
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */

/**
 * Get a patch
 * @param {Object} db DynamoDB client
 * @param {String} tableName Table name
 * @param {String} hashKey Applicant team id + Requested team id
 * @param {String} rangeKey Email del parche
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
            if (err) fn(err);
            else fn(null, data);
        }
    );
};

/**
 * Add a patch in the match
 * @param {Object} db DynamoDB client
 * @param {String} tableName Table name
 * @param {String} hashKey Applicant team id + Requested team id
 * @param {String} rangeKey Patch email
 * @param {String} joinedOn Join date
 * @param {Object} reqStat Request status
 * @param {Function} fn Callback
 */
const addMatchPatch = (
    db,
    tableName,
    hashKey,
    rangeKey,
    joinedOn,
    reqStat,
    fn
) => {
    db.putItem(
        {
            TableName: tableName,
            Item: {
                hashKey: { S: hashKey },
                rangeKey: { S: rangeKey },
                joinedOn: { S: joinedOn },
                reqStat: { M: reqStat },
            },
        },
        function (err, data) {
            if (err) fn(err);
            else
                fn(null, {
                    teamId1: hashKey.split('#')[1],
                    teamId2: hashKey.split('#')[2],
                    userEmail: rangeKey.split('#')[1],
                    joinedOn,
                    reqStat: JSON.stringify(reqStat),
                });
        }
    );
};

module.exports.getMatchPatch = getMatchPatch;
module.exports.addMatchPatch = addMatchPatch;
