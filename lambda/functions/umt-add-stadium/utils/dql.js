/**
 * Queries on AWS DynamoDB
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */

/**
 * Add a sport club
 * @param {Object} db DynamoDB client
 * @param {String} tableName Table name
 * @param {String} hashKey Id
 * @param {String} rangeKey Geolocation hash
 * @param {String} name Name
 * @param {String[]} matchFilter Match types supported
 * @param {Object} coords Location coordinates
 * @param {String} address Address
 * @param {Function} fn Callback
 */
const addStadium = (
    db,
    tableName,
    hashKey,
    rangeKey,
    name,
    matchFilter,
    coords,
    address,
    fn
) => {
    db.putItem(
        {
            TableName: tableName,
            Item: {
                hashKey: { S: hashKey },
                rangeKey: { S: rangeKey },
                name: { S: name },
                matchFilter: { SS: matchFilter },
                coords: { M: coords },
                address: { S: address },
            },
        },
        function (err, data) {
            if (err) fn(err);
            else
                fn(null, {
                    id: hashKey.split('#')[1],
                    geohash: rangeKey.split('#')[1],
                    name,
                    matchFilter,
                    coords: JSON.stringify(coords),
                    address,
                });
        }
    );
};

module.exports.addStadium = addStadium;
