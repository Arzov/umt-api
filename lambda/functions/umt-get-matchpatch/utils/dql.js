/**
 * Queries on AWS DynamoDB
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


// packages

const umtUtils = require('umt-utils');


// functions

/**
 * Get match patch
 * @param   {Object}    db          DynamoDB client
 * @param   {String}    tableName   Table name
 * @param   {String}    hashKey     Applicant team id + Requested team id
 * @param   {String}    rangeKey    User email
 * @param   {Function}  fn          Callback
 */
const getMatchPatch = (db, tableName, hashKey, rangeKey, fn) => {

    db.getItem(
        {
            TableName: tableName,
            Key: {
                hashKey     : { S: hashKey },
                rangeKey    : { S: rangeKey },
            },
        },

        function (err, data) {

            // error

            if (err) return fn(err);

            // return empty object

            else if (umtUtils.isObjectEmpty(data)) {
                fn(null, {});
            }

            // return result

            else {
                fn(null, {
                    teamId1     : data.Item.hashKey.S.split('#')[1],
                    teamId2     : data.Item.hashKey.S.split('#')[2],
                    email       : data.Item.rangeKey.S.split('#')[1],
                    reqStat     : JSON.stringify(data.Item.reqStat.M),
                    joinedOn    : data.Item.joinedOn.S,
                    expireOn    : data.Item.expireOn.S,
                });
            }
        }
    );
};


// export modules

module.exports.getMatchPatch = getMatchPatch;
