/**
 * Add sport club
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */

const aws = require('aws-sdk');
const umtEnvs = require('umt-envs');
const ngeohash = require('ngeohash');
const umtUtils = require('umt-utils');
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
    const hashKey = `${umtEnvs.pfx.STAD}${ngeohash.encode(
        latitude,
        longitude,
        geohashLength
    )}`;
    const rangeKey = `${umtEnvs.pfx.STAD}${umtUtils.nameToId(name)}`;
    const matchFilter = event.matchFilter;
    const address = event.address ? event.address : umtEnvs.dft.STADIUM.ADDRESS;

    dql.addStadium(
        dynamodb,
        process.env.DB_UMT_001,
        hashKey,
        rangeKey,
        name,
        matchFilter,
        coords,
        address,
        callback
    );
};
