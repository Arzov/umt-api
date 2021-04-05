/**
 * Queries on AWS DynamoDB
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */

/**
 * Add message into the chat
 * @param {Object} db DynamoDB client
 * @param {String} tableName Table name
 * @param {String} hashKey Applicant team id + Requested team id
 * @param {String} rangeKey Message send date + User email
 * @param {String} msg Message
 * @param {String} expireOn Match expire date
 * @param {String} GSI1PK User email
 * @param {String} GSI1SK Message send date
 * @param {String} sentOn Message send date
 * @param {Function} fn Callback
 */
const addMatchChat = (
    db,
    tableName,
    hashKey,
    rangeKey,
    msg,
    expireOn,
    GSI1PK,
    GSI1SK,
    sentOn,
    fn
) => {
    db.putItem(
        {
            TableName: tableName,
            Item: {
                hashKey: { S: hashKey },
                rangeKey: { S: rangeKey },
                msg: { S: msg },
                expireOn: { S: expireOn },
                GSI1PK: { S: GSI1PK },
                GSI1SK: { S: GSI1SK },
                sentOn: { S: sentOn },
            },
        },
        function (err, data) {
            if (err) fn(err);
            else
                fn(null, {
                    teamId1: hashKey.split('#')[1],
                    teamId2: hashKey.split('#')[2],
                    email: GSI1PK.split('#')[1],
                    msg,
                    expireOn,
                    sentOn,
                });
        }
    );
};

module.exports.addMatchChat = addMatchChat;
