/**
 * Queries on AWS DynamoDB
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */

/**
 * Update match
 * @param {Object} db DynamoDB client
 * @param {String} tableName Table name
 * @param {String} hashKey Applicant team id
 * @param {String} rangeKey Requested team id
 * @param {Object} patches Allowed patches
 * @param {String[]} positions Positions required for patch
 * @param {String[]} matchFilter Match types
 * @param {String} schedule Match date
 * @param {Object} reqStat Request status
 * @param {String} stadiumGeohash Sport club geolocation hash
 * @param {String} stadiumId Sport club id
 * @param {String} courtId Court id
 * @param {String[]} genderFilter Gender of players
 * @param {String} ageMinFilter Min. players age
 * @param {String} ageMaxFilter Max. players age
 * @param {String} geohash Geolocation hash
 * @param {Object} coords Location coordinates
 * @param {Function} fn Callback
 */
const updateMatch = (
    db,
    tableName,
    hashKey,
    rangeKey,
    patches,
    positions,
    matchFilter,
    schedule,
    reqStat,
    stadiumGeohash,
    stadiumId,
    courtId,
    genderFilter,
    ageMinFilter,
    ageMaxFilter,
    geohash, // just for return not for update
    coords, // just for return not for update
    fn
) => {
    db.updateItem(
        {
            TableName: tableName,
            Key: {
                hashKey: { S: hashKey },
                rangeKey: { S: rangeKey },
            },
            UpdateExpression: `
            set patches = :v1, positions = :v2, matchFilter = :v3,
            schedule = :v4, reqStat = :v5, stadiumGeohash = :v6, stadiumId = :v7,
            courtId = :v8, genderFilter = :v9, ageMinFilter = :v10, ageMaxFilter = :v11
        `,
            ExpressionAttributeValues: {
                ':v1': { M: patches },
                ':v2': { SS: positions },
                ':v3': { SS: matchFilter },
                ':v4': { S: schedule },
                ':v5': { M: reqStat },
                ':v6': { S: stadiumGeohash },
                ':v7': { S: stadiumId },
                ':v8': { N: courtId },
                ':v9': { SS: genderFilter },
                ':v10': { N: ageMinFilter },
                ':v11': { N: ageMaxFilter },
            },
        },
        function (err, data) {
            if (err) fn(err);
            else
                fn(null, {
                    teamId1: hashKey.split('#')[1],
                    teamId2: rangeKey.split('#')[1],
                    patches: JSON.stringify(patches),
                    positions,
                    matchFilter,
                    schedule,
                    reqStat: JSON.stringify(reqStat),
                    stadiumGeohash,
                    stadiumId,
                    courtId,
                    genderFilter,
                    ageMinFilter,
                    ageMaxFilter,
                    geohash,
                    coords,
                });
        }
    );
};

/**
 * Delete match
 * @param {Object} db DynamoDB client
 * @param {String} tableName Table name
 * @param {String} hashKey Applicant team id
 * @param {String} rangeKey Requested team id
 * @param {Function} fn Callback
 */
const deleteMatch = (db, tableName, hashKey, rangeKey, fn) => {
    db.deleteItem(
        {
            TableName: tableName,
            Key: {
                hashKey: { S: hashKey },
                rangeKey: { S: rangeKey },
            },
        },
        function (err, data) {
            if (err) fn(err);
            else {
                const err = new Error(
                    JSON.stringify({
                        code: 'MatchDeletedException',
                        message: `Partido eliminado.`,
                    })
                );
                fn(err);
            }
        }
    );
};

module.exports.updateMatch = updateMatch;
module.exports.deleteMatch = deleteMatch;
