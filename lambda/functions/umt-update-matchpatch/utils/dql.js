/**
 * Queries on AWS DynamoDB
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


/**
 * Update a patch in a match
 * @param   {Object}    db              DynamoDB client
 * @param   {String}    tableName       Table name
 * @param   {String}    hashKey         Applicant team id + Requested team id
 * @param   {String}    rangeKey        User email
 * @param   {String}    name            Patch's name
 * @param   {Object}    reqStat         Request status
 * @param   {Function}  fn              Callback
 */
const updateMatchPatch = (
    db,
    tableName,
    hashKey,
    rangeKey,
    name,
    reqStat,
    fn
) => {


    // init expressions

    let ddbExpressions = {
        UpdateExpression: `
            set
            #v1 = :v1,
            reqStat = :v2
        `,
        ExpressionAttributeNames: {
            '#v1': 'name'
        },
        ExpressionAttributeValues: {
            ':v1': { S: name },
            ':v2': { M: reqStat }
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
                    teamId1 : hashKey.split('#')[1],
                    teamId2 : hashKey.split('#')[2],
                    email   : rangeKey.split('#')[1],
                    reqStat : JSON.stringify(reqStat),
                    name
                });
        }
    );
};


/**
 * Delete a patch in a match
 * @param   {Object}    db          DynamoDB client
 * @param   {String}    tableName   Table name
 * @param   {String}    hashKey     Applicant team id + Requested team id
 * @param   {String}    rangeKey    User email
 * @param   {Function}  fn          Callback
 */
const deleteMatchPatch = (db, tableName, hashKey, rangeKey, fn) => {
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
                fn(null, {
                    teamId1 : hashKey.split('#')[1],
                    teamId2 : hashKey.split('#')[2],
                    email   : rangeKey.split('#')[1]
                });
            }
        }
    );
};


// export modules

module.exports.updateMatchPatch = updateMatchPatch;
module.exports.deleteMatchPatch = deleteMatchPatch;
