/**
 * Queries on AWS DynamoDB
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */

/**
 * Add user
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
const addUser = (
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
    db.putItem(
        {
            TableName: tableName,
            Item: {
                hashKey: { S: hashKey },
                rangeKey: { S: rangeKey },
                geohash: { S: geohash },
                coords: { M: coords },
                ageMinFilter: { N: ageMinFilter },
                ageMaxFilter: { N: ageMaxFilter },
                matchFilter: { SS: matchFilter },
                positions: { SS: positions },
                skills: { M: skills },
                foot: { S: foot },
                weight: { N: weight },
                height: { N: height },
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

module.exports.addUser = addUser;
