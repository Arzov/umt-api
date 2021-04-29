/**
 * Queries on AWS DynamoDB
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


/**
 * Update team member
 * @param   {Object}    db              DynamoDB client
 * @param   {String}    tableName       Table name
 * @param   {String}    hashKey         Team id
 * @param   {String}    rangeKey        Email
 * @param   {String}    name            User name
 * @param   {Object}    position        Player position in team formation
 * @param   {String[]}  role            Player role ('Captain', 'Player', 'Admin')
 * @param   {String}    number          Player number
 * @param   {Object}    reqStat         Request status
 * @param   {Function}  fn              Callback
 */
const updateTeamMember = (
    db,
    tableName,
    hashKey,
    rangeKey,
    name,
    position,
    role,
    number,
    reqStat,
    fn
) => {


    // init expressions

    let ddbExpressions = {
        UpdateExpression: `
            set
            #v1 = :v1,
            #v2 = :v2,
            #v3 = :v3,
            #v4 = :v4,
            reqStat = :v5
        `,
        ExpressionAttributeNames: {
            '#v1': 'name',
            '#v2': 'position',
            '#v3': 'role',
            '#v4': 'number'
        },
        ExpressionAttributeValues: {
            ':v1'   : { S   : name },
            ':v2'   : { M   : position },
            ':v3'   : { SS  : role },
            ':v4'   : { N   : number },
            ':v5'   : { M   : reqStat }
        }
    };


    // `ExpressionAttributeNames` seems not work in local execution

    if (process.env.RUN_MODE === 'LOCAL') {
        ddbExpressions = {
            UpdateExpression: `set reqStat = :v1`,
            ExpressionAttributeValues: {
                ':v1': { M: reqStat }
            }
        };
    }

    db.updateItem(
        {
            TableName: tableName,
            Key: {
                hashKey     : { S: hashKey },
                rangeKey    : { S: rangeKey },
            },
            ...ddbExpressions
        },

        function (err, data) {

            if (err) fn(err);

            else
                fn(null, {
                    teamId  : hashKey.split('#')[1],
                    email   : rangeKey.split('#')[1],
                    reqStat : JSON.stringify(reqStat),
                    name,
                    position,
                    role,
                    number
                });
        }
    );
};


/**
 * Delete team member
 * @param   {Object}    db          DynamoDB client
 * @param   {String}    tableName   Table name
 * @param   {String}    hashKey     Team id
 * @param   {String}    rangeKey    Email
 * @param   {Function}  fn          Callback
 */
const deleteTeamMember = (db, tableName, hashKey, rangeKey, fn) => {
    db.deleteItem(
        {
            TableName: tableName,
            Key: {
                hashKey     : { S: hashKey },
                rangeKey    : { S: rangeKey },
            },
        },

        function (err, data) {

            if (err) fn(err);

            else {
                const err = new Error(
                    JSON.stringify({
                        code    : 'TeamMemberDeletedException',
                        message : `Jugador eliminado.`,
                    })
                );

                fn(err);
            }
        }
    );
};


// export modules

module.exports.updateTeamMember = updateTeamMember;
module.exports.deleteTeamMember = deleteTeamMember;
