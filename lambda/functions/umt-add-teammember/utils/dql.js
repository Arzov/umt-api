/**
 * Queries on AWS DynamoDB
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


/**
 * Add a team member
 * @param   {Object}    db          DynamoDB client
 * @param   {String}    tableName   Table name
 * @param   {String}    hashKey     Team id
 * @param   {String}    rangeKey    User email
 * @param   {Object}    position    Player position in team formation
 * @param   {String[]}  role        Player role ('Captain', 'Player', 'Admin')
 * @param   {Object}    reqStat     Request status
 * @param   {String}    number      Player number
 * @param   {String}    joinedOn    Join date
 * @param   {String}    GSI1PK      User email
 * @param   {String}    name        User name
 */
const addTeamMember = async (
    db,
    tableName,
    hashKey,
    rangeKey,
    position,
    role,
    reqStat,
    number,
    joinedOn,
    GSI1PK,
    name
) => {

    try {

        await db.putItem({
            TableName: tableName,
            Item: {
                hashKey : { S   : hashKey },
                rangeKey: { S   : rangeKey },
                position: { M   : position },
                role    : { SS  : role },
                reqStat : { M   : reqStat },
                number  : { N   : number },
                joinedOn: { S   : joinedOn },
                GSI1PK  : { S   : GSI1PK },
                GSI1SK  : { S   : hashKey },
                name    : { S   : name }
            },
        }).promise();

        return {
            teamId  : hashKey.split('#')[1],
            email   : rangeKey.split('#')[1],
            position: JSON.stringify(position),
            reqStat : JSON.stringify(reqStat),
            role,
            number,
            joinedOn,
            name
        };

    }

    catch (e) {
        return err;
    }

};


// export modules

module.exports.addTeamMember = addTeamMember;
