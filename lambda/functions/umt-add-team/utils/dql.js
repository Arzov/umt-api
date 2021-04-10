/**
 * Queries on AWS DynamoDB
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */

/**
 * Add a team
 * @param {Object} db DynamoDB client
 * @param {String} tableName Table name
 * @param {String} hashKey Team id
 * @param {String} rangeKey Team id
 * @param {String} name Name
 * @param {String} picture Picture URL
 * @param {String} ageMinFilter Min. age of the team players
 * @param {String} ageMaxFilter Max. age of the team players
 * @param {String[]} matchFilter Match types which team participate
 * @param {String[]} genderFilter Gender of the players
 * @param {Object} formation Team formation for each mathc type
 * @param {String} geohash Geolocation hash
 * @param {Object} coords Location coordinates
 * @param {String} createdOn Creation date of the team
 * @param {Function} fn Callback
 */
const addTeam = (
    db,
    tableName,
    hashKey,
    rangeKey,
    geohash,
    name,
    picture,
    ageMinFilter,
    ageMaxFilter,
    matchFilter,
    genderFilter,
    formation,
    coords,
    createdOn,
    fn
) => {
    db.putItem(
        {
            TableName: tableName,
            Item: {
                hashKey: { S: hashKey },
                rangeKey: { S: rangeKey },
                geohash: { S: geohash },
                name: { S: name },
                picture: { S: picture },
                ageMinFilter: { N: ageMinFilter },
                ageMaxFilter: { N: ageMaxFilter },
                matchFilter: { SS: matchFilter },
                genderFilter: { SS: genderFilter },
                formation: { M: formation },
                coords: { M: coords },
                createdOn: { S: createdOn },
            },
        },
        function (err, data) {
            if (err) fn(err);
            else
                fn(null, {
                    id: hashKey.split('#')[1],
                    geohash,
                    name,
                    picture,
                    ageMinFilter,
                    ageMaxFilter,
                    matchFilter,
                    genderFilter,
                    formation: JSON.stringify(formation),
                    coords: JSON.stringify(coords),
                    createdOn,
                });
        }
    );
};

module.exports.addTeam = addTeam;
