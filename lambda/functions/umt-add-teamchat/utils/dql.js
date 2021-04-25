/**
 * Queries on AWS DynamoDB
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


/**
 * Add a message into the chat
 * @param   {Object}    db          DynamoDB client
 * @param   {String}    tableName   Table name
 * @param   {String}    hashKey     Team id
 * @param   {String}    rangeKey    Message send date + User email
 * @param   {String}    author      Name of the sender
 * @param   {String}    msg         Message
 * @param   {String}    expireOn    Message expire date
 * @param   {String}    GSI1PK      User email
 * @param   {String}    GSI1SK      Message send date
 * @param   {String}    sentOn      Message send date
 * @param   {Function}  fn          Callback
 */
const addTeamChat = (
    db,
    tableName,
    hashKey,
    rangeKey,
    author,
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
                hashKey     : { S: hashKey },
                rangeKey    : { S: rangeKey },
                author      : { S: author },
                msg         : { S: msg },
                expireOn    : { S: expireOn },
                GSI1PK      : { S: GSI1PK },
                GSI1SK      : { S: GSI1SK },
                sentOn      : { S: sentOn },
            },
        },

        function (err, data) {
            if (err) fn(err);
            else
                fn(null, {
                    teamId: hashKey.split('#')[1],
                    email: GSI1PK.split('#')[1],
                    sentOn,
                    author,
                    msg,
                    expireOn,
                });
        }
    );
};


// export modules

module.exports.addTeamChat = addTeamChat;
