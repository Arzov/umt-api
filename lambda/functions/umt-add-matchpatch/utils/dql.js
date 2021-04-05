/**
 * Queries on AWS DynamoDB
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */

/**
 * Add a patch in the match
 * @param {Object} db DynamoDB client
 * @param {String} tableName Table name
 * @param {String} hashKey Applicant team id + Requested team id
 * @param {String} rangeKey User email
 * @param {String} joinedOn Join date
 * @param {Object} reqStat Request status
 * @param {String} expireOn Expire date of the match
 * @param {String} GSI1PK User email
 * @param {String} GSI1SK Applicant team id + Requested team id
 * @param {Function} fn Callback
 */
const addMatchPatch = (
    db,
    tableName,
    hashKey,
    rangeKey,
    joinedOn,
    reqStat,
    expireOn,
    GSI1PK,
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
                expireOn: { S: expireOn },
                GSI1PK: { S: GSI1PK },
                GSI1SK: { S: hashKey },
            },
        },
        function (err, data) {
            if (err) fn(err);
            else
                fn(null, {
                    teamId1: hashKey.split('#')[1],
                    teamId2: hashKey.split('#')[2],
                    email: GSI1PK.split('#')[1],
                    joinedOn,
                    reqStat: JSON.stringify(reqStat),
                    expireOn,
                });
        }
    );
};

module.exports.addMatchPatch = addMatchPatch;
