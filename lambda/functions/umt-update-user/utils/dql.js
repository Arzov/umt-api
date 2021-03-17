/**
 * Queries on AWS DynamoDB
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */

/**
 * Update user
 * @param {Object} db DynamoDB client
 * @param {String} tableName Table name
 * @param {String} hashKey Email
 * @param {String} rangeKey Email
 * @param {String} geohash Geolocation hash
 * @param {Object} coords Latitude - Longitude coordinates
 * @param {String} ageMinFilter Min. age filter
 * @param {String} ageMaxFilter Max. age filter
 * @param {String[]} matchFilter Match types filter
 * @param {Object} skills Skills
 * @param {String[]} positions Game positions
 * @param {String} foot Preferred foot
 * @param {String} weight Weight
 * @param {String} height Height
 * @param {Function} fn Callback
 */
const updateUser = (
    db,
    tableName,
    hashKey,
    rangeKey,
    geohash,
    coords,
    ageMinFilter,
    ageMaxFilter,
    matchFilter,
    positions,
    skills,
    foot,
    weight,
    height,
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
            set geohash = :v1, coords = :v2,
            ageMinFilter = :v4, ageMaxFilter = :v5, matchFilter = :v6, positions = :v7,
            skills = :v8, foot = :v9, weight = :v10, height = :v11`,
            ExpressionAttributeValues: {
                ':v1': { S: geohash },
                ':v2': { M: coords },
                ':v4': { N: ageMinFilter },
                ':v5': { N: ageMaxFilter },
                ':v6': { SS: matchFilter },
                ':v7': { SS: positions },
                ':v8': { M: skills },
                ':v9': { S: foot },
                ':v10': { N: weight },
                ':v11': { N: height },
            },
        },
        function (err, data) {
            if (err) fn(err);
            else
                fn(null, {
                    email: hashKey.split('#')[1],
                    geohash,
                    coords: JSON.stringify(coords),
                    ageMinFilter,
                    ageMaxFilter,
                    matchFilter,
                    positions,
                    skills: JSON.stringify(skills),
                    foot,
                    weight,
                    height,
                });
        }
    );
};

module.exports.updateUser = updateUser;
