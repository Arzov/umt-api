/**
 * Queries on AWS DynamoDB
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


// packages

const umtUtils = require('umt-utils');


// functions

/**
 * Get match
 * @param   {Object}    db          DynamoDB client
 * @param   {String}    tableName   Table name
 * @param   {String}    hashKey     Applicant team id
 * @param   {String}    rangeKey    Requested team id
 * @param   {Function}  fn          Callback
 */
const getMatch = (db, tableName, hashKey, rangeKey, fn) => {
    db.getItem(
        {
            TableName: tableName,
            Key: {
                hashKey     : { S: hashKey },
                rangeKey    : { S: rangeKey },
            },
        },

        function (err, data) {
            if (err) return fn(err);

            // return empty object

            else if (umtUtils.isObjectEmpty(data)) {
                fn(null, {});
            }

            // return result

            else {
                fn(null, {
                    teamId1         : data.Item.hashKey.S.split('#')[1],
                    teamId2         : data.Item.rangeKey.S.split('#')[1],
                    patches         : JSON.stringify(data.Item.patches.M),
                    positions       : data.Item.positions.SS,
                    matchFilter     : data.Item.matchFilter.SS,
                    schedule        : data.Item.schedule.S,
                    reqStat         : JSON.stringify(data.Item.reqStat.M),
                    stadiumGeohash  : data.Item.stadiumGeohash.S,
                    stadiumId       : data.Item.stadiumId.S,
                    courtId         : data.Item.courtId.N,
                    genderFilter    : data.Item.genderFilter.SS,
                    ageMinFilter    : data.Item.ageMinFilter.N,
                    ageMaxFilter    : data.Item.ageMaxFilter.N,
                    geohash         : data.Item.geohash.S,
                    coords          : JSON.stringify(data.Item.coords.M),
                    expireOn        : data.Item.expireOn.S,
                    createdOn       : data.Item.createdOn.S,
                });
            }
        }
    );
};


// export modules

module.exports.getMatch = getMatch;
