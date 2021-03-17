/**
 * Queries on AWS DynamoDB
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */

/**
 * Add a team member
 * @param {Object} db DynamoDB client
 * @param {String} tableName Table name
 * @param {String} hashKey Team id
 * @param {String} rangeKey Player email
 * @param {Object} position Player position in team formation
 * @param {String[]} role Player role ('Captain', 'Player', 'Admin')
 * @param {Object} reqStat Request status
 * @param {String} number Player number
 * @param {String} joinedOn Join date
 * @param {Function} fn Callback
 */
const addTeamMember = (
    db,
    tableName,
    hashKey,
    rangeKey,
    position,
    role,
    reqStat,
    number,
    joinedOn,
    fn
) => {
    db.putItem(
        {
            TableName: tableName,
            Item: {
                hashKey: { S: hashKey },
                rangeKey: { S: rangeKey },
                position: { M: position },
                role: { SS: role },
                reqStat: { M: reqStat },
                number: { N: number },
                joinedOn: { S: joinedOn },
            },
        },
        function (err, data) {
            if (err) fn(err);
            else
                fn(null, {
                    teamId: hashKey.split('#')[1],
                    userEmail: rangeKey.split('#')[1],
                    position: JSON.stringify(position),
                    role,
                    reqStat: JSON.stringify(reqStat),
                    number,
                    joinedOn,
                });
        }
    );
};

module.exports.addTeamMember = addTeamMember;
