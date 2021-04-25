/**
 * Queries on AWS DynamoDB
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


// packages

const umtEnvs = require('umt-envs');


// functions

/**
 * Get `id` of latest court added
 * @param   {Object}    db          DynamoDB client
 * @param   {String}    tableName   Table name
 * @param   {String}    hashKey     Stadium id
 * @param   {String}    rangeKey    Geohash of stadium
 * @param   {Function}  fn          Callback
 */
const getLastCourtId = (db, tableName, hashKey, rangeKey, fn) => {

    db.query(
        {
            TableName: tableName,
            TableName: tableName,
            KeyConditionExpression: `
                hashKey = :v1 and begins_with ( rangeKey, :v2 )
            `,
            ExpressionAttributeValues: {
                ':v1': { S: hashKey },
                ':v2': { S: rangeKey },
            },
            ScanIndexForward: false,
            Limit: 1,
        },

        function (err, data) {
            if (err) fn(err);
            else {
                if (data.Count)
                    fn(null, Number(data.Items[0].rangeKey.S.split('#')[2]));
                else fn(null, 0);
            }
        }
    );
};


/**
 * Add a court
 * @param   {Object}    db          DynamoDB client
 * @param   {String}    tableName   Table name
 * @param   {String}    hashKey     Stadium id
 * @param   {String}    rangeKey    Geolocation of stadium + Court id
 * @param   {String[]}  matchFilter Match type supported
 * @param   {String}    material    Material
 * @param   {String}    createdOn   Creation date of the court
 * @param   {Function}  fn          Callback
 */
const addCourt = (
    db,
    tableName,
    hashKey,
    rangeKey,
    matchFilter,
    material,
    createdOn,
    fn
) => {

    db.putItem(
        {
            TableName: tableName,
            Item: {
                hashKey     : { S   : hashKey },
                rangeKey    : { S   : rangeKey },
                matchFilter : { SS  : matchFilter },
                material    : { S   : material },
                createdOn   : { S   : createdOn },
            },
        },

        function (err, data) {
            if (err) fn(err);
            else
                fn(null, {
                    stadiumId: hashKey.split('#')[1],
                    stadiumGeohash: rangeKey.split('#')[1],
                    id: rangeKey.split('#')[2],
                    matchFilter,
                    material,
                    createdOn,
                });
        }
    );
};


// export modules

module.exports.getLastCourtId = getLastCourtId;
module.exports.addCourt = addCourt;
