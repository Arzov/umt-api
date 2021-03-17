/**
 * Queries on AWS DynamoDB
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */

/**
 * Add a message into the chat
 * @param {Object} db DynamoDB client
 * @param {String} tableName Table name
 * @param {String} hashKey Team id
 * @param {String} rangeKey Message send date + Player email
 * @param {String} msg Message
 * @param {Function} fn Callback
 */
const addTeamChat = (db, tableName, hashKey, rangeKey, msg, fn) => {
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
                    teamId: hashKey.split('#')[1],
                    userEmail: rangeKey.split('#')[2],
                    sentOn: rangeKey.split('#')[1],
                    msg,
                });
        }
    );
};

module.exports.addTeamChat = addTeamChat;
