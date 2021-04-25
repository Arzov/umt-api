/**
 * Queries on AWS DynamoDB
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


// packages

const umtEnvs = require('umt-envs');
const fns = require('./fns');


// functions

/**
 * Get team matches like owner
 * @param   {Object}      db            DynamoDB client
 * @param   {String}      tableName     Table name
 * @param   {String}      hashKey       Team id
 * @param   {Integer}     limitScan     Query limit scan result
 * @param   {String}      nextToken     Last query scanned object
 * @param   {Function}    fn            Callback
 */
const listOwnerMatches = (db, tableName, hashKey, limitScan, nextToken, fn) => {

    const keyExp = `hashKey = :v1 and begins_with (rangeKey, :v2)`;
    const filterExp = `reqStat.AR = :v3 and reqStat.RR = :v3`;
    const expValues = {
        ':v1': { S: hashKey },
        ':v2': { S: umtEnvs.pfx.MATCH },
        ':v3': { S: 'A' },
    };

    db.query(
        {
            TableName: tableName,
            KeyConditionExpression: keyExp,
            FilterExpression: filterExp,
            ExpressionAttributeValues: expValues,
            ExclusiveStartKey: nextToken ? JSON.parse(nextToken) : undefined,
            Limit: limitScan,
        },
        function (err, data) {
            if (err) fn(err);
            else fns.parseData(data, fn);
        }
    );
};


/**
 * Get team matches like guest
 * @param   {Object}    db          DynamoDB client
 * @param   {String}    tableName   Table name
 * @param   {String}    GSI1PK      Team id
 * @param   {Integer}   limitScan   Query limit scan result
 * @param   {String}    nextToken   Last query scanned object
 * @param   {Function}  fn          Callback
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

    db.query(
        {
            TableName: tableName,
            IndexName: idx,
            KeyConditionExpression: keyExp,
            FilterExpression: filterExp,
            ExpressionAttributeValues: expValues,
            ExclusiveStartKey: nextToken ? JSON.parse(nextToken) : undefined,
            Limit: limitScan,
        },
        function (err, data) {
            if (err) fn(err);
            else fns.parseData(data, fn);
        }
    );
};


/**
 * Get patch matches
 * @param   {Object}    db          DynamoDB client
 * @param   {String}    tableName   Table name
 * @param   {String}    GSI1PK      User email
 * @param   {Integer}   limitScan   Query limit scan result
 * @param   {String}    nextToken   Last query scanned object
 * @param   {Function}  fn          Callback
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

    db.query(
        {
            TableName: tableName,
            IndexName: idx,
            KeyConditionExpression: keyExp,
            FilterExpression: filterExp,
            ExpressionAttributeValues: expValues,
            ExclusiveStartKey: nextToken ? JSON.parse(nextToken) : undefined,
            Limit: limitScan,
        },
        function (err, data) {
            if (err) fn(err);
            else fn(null, data);
        }
    );
};


// export modules

module.exports.listOwnerMatches = listOwnerMatches;
module.exports.listGuestMatches = listGuestMatches;
module.exports.listPatchMatches = listPatchMatches;
