/**
 * Queries on AWS DynamoDB
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


// packages

const umtUtils = require('umt-utils');


// functions

/**
 * Get user
 * @param   {Object}    db          DynamoDB client
 * @param   {String}    tableName   Table name
 * @param   {String}    hashKey     Email
 * @param   {String}    rangeKey    Email
 * @param   {Function}  fn          Callback
 */
const getUser = (db, tableName, hashKey, rangeKey, fn) => {

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
                    email: data.Item.hashKey.S.split('#')[1],
                    geohash: data.Item.geohash.S,
                    coords: JSON.stringify(data.Item.coords.M),
                    ageMinFilter: data.Item.ageMinFilter.N,
                    ageMaxFilter: data.Item.ageMaxFilter.N,
                    matchFilter: data.Item.matchFilter.SS,
                    positions: data.Item.positions.SS,
                    skills: JSON.stringify(data.Item.skills.M),
                    foot: data.Item.foot.S,
                    weight: data.Item.weight.N,
                    height: data.Item.height.N,
                });
            }
        }
    );
};


// export modules

module.exports.getUser = getUser;
