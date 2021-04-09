/**
 * Queries on AWS DynamoDB
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */

const umtEnvs = require('umt-envs');

/**
 * Parse match data
 * @param {String} data Matches data
 * @param {Function} fn Callback
 */
const parseData = (data, fn) => {
    let result = {
        Count: data.Count,
        Items: [],
        LastEvaluatedKey: null,
    };

    if ('LastEvaluatedKey' in data)
        result.LastEvaluatedKey = JSON.stringify(data.LastEvaluatedKey);

    if (result.Count) {
        result.Items = data.Items.map((m) => {
            return {
                teamId1: m.hashKey.S.split('#')[1],
                teamId2: m.rangeKey.S.split('#')[1],
                patches: JSON.stringify(m.patches.M),
                positions: m.positions.SS,
                matchFilter: m.matchFilter.SS,
                schedule: m.schedule.S,
                reqStat: JSON.stringify(m.reqStat.M),
                stadiumGeohash: m.stadiumGeohash.S,
                stadiumId: m.stadiumId.S,
                courtId: m.courtId.N,
                genderFilter: m.genderFilter.SS,
                ageMinFilter: m.ageMinFilter.N,
                ageMaxFilter: m.ageMaxFilter.N,
                geohash: m.geohash.S,
                coords: JSON.stringify(m.coords.M),
                expireOn: m.expireOn.S,
                createdOn: m.createdOn.S,
            };
        });
    }

    fn(null, result);
};

/**
 * Get team matches like owner
 * @param {Object} db DynamoDB client
 * @param {String} tableName Table name
 * @param {String} hashKey Team id
 * @param {Integer} limitScan Query limit scan result
 * @param {String} nextToken Last query scanned object
 * @param {Function} fn Callback
 */
const listOwnerMatches = (db, tableName, hashKey, limitScan, nextToken, fn) => {
    const keyExp = `hashKey = :v1 and begins_with (rangeKey, :v2)`;
    const filterExp = `reqStat.AR = :v3 and reqStat.RR = :v3`;
    const expValues = {
        ':v1': { S: hashKey },
        ':v2': { S: umtEnvs.pfx.MATCH },
        ':v3': { S: 'A' },
    };

    if (nextToken) {
        db.query(
            {
                TableName: tableName,
                KeyConditionExpression: keyExp,
                FilterExpression: filterExp,
                ExpressionAttributeValues: expValues,
                ExclusiveStartKey: JSON.parse(nextToken),
                Limit: limitScan,
            },
            function (err, data) {
                if (err) fn(err);
                else parseData(data, fn);
            }
        );
    } else {
        db.query(
            {
                TableName: tableName,
                KeyConditionExpression: keyExp,
                FilterExpression: filterExp,
                ExpressionAttributeValues: expValues,
                Limit: limitScan,
            },
            function (err, data) {
                if (err) fn(err);
                else parseData(data, fn);
            }
        );
    }
};

/**
 * Get team matches like guest
 * @param {Object} db DynamoDB client
 * @param {String} tableName Table name
 * @param {String} GSI1PK Team id
 * @param {Integer} limitScan Query limit scan result
 * @param {String} nextToken Last query scanned object
 * @param {Function} fn Callback
 */
const listGuestMatches = (db, tableName, GSI1PK, limitScan, nextToken, fn) => {
    const idx = 'GSI1';
    const keyExp = `GSI1PK = :v1 and begins_with (GSI1SK, :v2)`;
    const filterExp = `reqStat.AR = :v3 and reqStat.RR = :v3`;
    const expValues = {
        ':v1': { S: GSI1PK },
        ':v2': { S: umtEnvs.pfx.MATCH },
        ':v3': { S: 'A' },
    };

    if (nextToken) {
        db.query(
            {
                TableName: tableName,
                IndexName: idx,
                KeyConditionExpression: keyExp,
                FilterExpression: filterExp,
                ExpressionAttributeValues: expValues,
                ExclusiveStartKey: JSON.parse(nextToken),
                Limit: limitScan,
            },
            function (err, data) {
                if (err) fn(err);
                else parseData(data, fn);
            }
        );
    } else {
        db.query(
            {
                TableName: tableName,
                IndexName: idx,
                KeyConditionExpression: keyExp,
                FilterExpression: filterExp,
                ExpressionAttributeValues: expValues,
                Limit: limitScan,
            },
            function (err, data) {
                if (err) fn(err);
                else parseData(data, fn);
            }
        );
    }
};

/**
 * Get patch matches
 * @param {Object} db DynamoDB client
 * @param {String} tableName Table name
 * @param {String} GSI1PK User email
 * @param {Integer} limitScan Query limit scan result
 * @param {String} nextToken Last query scanned object
 * @param {Function} fn Callback
 */
const listPatchMatches = (db, tableName, GSI1PK, limitScan, nextToken, fn) => {
    const idx = 'GSI1';
    const keyExp = `GSI1PK = :v1 and begins_with (GSI1SK, :v2)`;
    const filterExp = `reqStat.MR = :v3 and reqStat.PR = :v3`;
    const expValues = {
        ':v1': { S: GSI1PK },
        ':v2': { S: umtEnvs.pfx.MATCH },
        ':v3': { S: 'A' },
    };

    if (nextToken) {
        db.query(
            {
                TableName: tableName,
                IndexName: idx,
                KeyConditionExpression: keyExp,
                FilterExpression: filterExp,
                ExpressionAttributeValues: expValues,
                ExclusiveStartKey: JSON.parse(nextToken),
                Limit: limitScan,
            },
            function (err, data) {
                if (err) fn(err);
                else fn(null, data);
            }
        );
    } else {
        db.query(
            {
                TableName: tableName,
                IndexName: idx,
                KeyConditionExpression: keyExp,
                FilterExpression: filterExp,
                ExpressionAttributeValues: expValues,
                Limit: limitScan,
            },
            function (err, data) {
                if (err) fn(err);
                else fn(null, data);
            }
        );
    }
};

module.exports.listOwnerMatches = listOwnerMatches;
module.exports.listGuestMatches = listGuestMatches;
module.exports.listPatchMatches = listPatchMatches;
