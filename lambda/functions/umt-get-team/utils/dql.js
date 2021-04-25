/**
 * Queries on AWS DynamoDB
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


// packages

const umtUtils = require('umt-utils');


// functions

/**
 * Get team
 * @param   {Object}    db          DynamoDB client
 * @param   {String}    tableName   Table name
 * @param   {String}    hashKey     Team id
 * @param   {String}    rangeKey    Team id
 * @param   {Function}  fn          Callback
 */
const getTeam = (db, tableName, hashKey, rangeKey, fn) => {

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
                    id              : data.Item.hashKey.S.split('#')[1],
                    name            : data.Item.name.S,
                    picture         : data.Item.picture.S,
                    ageMinFilter    : data.Item.ageMinFilter.N,
                    ageMaxFilter    : data.Item.ageMaxFilter.N,
                    genderFilter    : data.Item.genderFilter.SS,
                    matchFilter     : data.Item.matchFilter.SS,
                    formation       : JSON.stringify(data.Item.formation.M),
                    geohash         : data.Item.geohash.S,
                    coords          : JSON.stringify(data.Item.coords.M),
                    createdOn       : data.Item.createdOn.S,
                });
            }
        }
    );
};


// export modules

module.exports.getTeam = getTeam;
