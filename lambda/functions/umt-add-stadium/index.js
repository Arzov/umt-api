/**
 * Add a sport club or stadium
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */

const umtEnvs = require('umt-envs');
const umtUtils = require('umt-utils');
const ngeohash = require('ngeohash');
const aws = require('aws-sdk');
const dql = require('utils/dql');

const geohashLength = umtEnvs.gbl.GEOHASH_LENGTH;
let options = umtEnvs.gbl.DYNAMODB_CONFIG;

if (process.env.RUN_MODE === 'LOCAL') options = umtEnvs.dev.DYNAMODB_CONFIG;

const dynamodb = new aws.DynamoDB(options);

exports.handler = function (event, context, callback) {
    const name = umtUtils.cleanName(event.name.toUpperCase().trim());
    const latitude = event.latitude;
    const longitude = event.longitude;

    const coords = {
        LON: { N: String(longitude) },
        LAT: { N: String(latitude) },
    };

    const hashKey = `${umtEnvs.pfx.STADIUM}${umtUtils.nameToId(name)}`;
    const geohash = ngeohash.encode(latitude, longitude, geohashLength);
    const rangeKey = `${umtEnvs.pfx.STADIUM}${geohash}`;
    const matchFilter = event.matchFilter;
    const address = event.address ? event.address : umtEnvs.dft.STADIUM.ADDRESS;
    const createdOn = new Date().toISOString();

    dql.addStadium(
        dynamodb,
        process.env.DB_UMT_001,
        hashKey,
        rangeKey,
        name,
        matchFilter,
        coords,
        address,
        geohash,
        createdOn,
        callback
    );
};
