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
 * @param {Function} fn Callback
 */
const addMatchChat = (db, tableName, hashKey, rangeKey, msg, fn) => {
    db.putItem(
        {
            TableName: tableName,
            Item: {
                hashKey: { S: hashKey },
                rangeKey: { S: rangeKey },
                msg: { S: msg },
            },
        },
        function (err, data) {
            if (err) fn(err);
            else
                fn(null, {
                    teamId1: hashKey.split('#')[1],
                    teamId2: hashKey.split('#')[2],
                    email: rangeKey.split('#')[2],
                    sentOn: rangeKey.split('#')[1],
                    msg,
                });
        }
    );
};

module.exports.addMatchChat = addMatchChat;
