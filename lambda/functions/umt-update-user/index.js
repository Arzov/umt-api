/**
 * Update user
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */

const aws = require('aws-sdk');
const umtEnvs = require('umt-envs');
const ngeohash = require('ngeohash');
const dql = require('utils/dql');
const geohashLength = umtEnvs.gbl.GEOHASH_LENGTH;
let options = umtEnvs.gbl.DYNAMODB_CONFIG;

if (process.env.RUN_MODE === 'LOCAL') options = umtEnvs.dev.DYNAMODB_CONFIG;

const dynamodb = new aws.DynamoDB(options);

exports.handler = function (event, context, callback) {
    const latitude = event.latitude;
    const longitude = event.longitude;
    const hashKey = `${umtEnvs.pfx.USR}${event.email}`;
    const ageMinFilter = String(event.ageMinFilter);
    const ageMaxFilter = String(event.ageMaxFilter);
    const matchFilter = event.matchFilter;
    const positions = event.positions;
    const skills = JSON.parse(event.skills);
    const foot = event.foot;
    const weight = String(event.weight);
    const height = String(event.height);
    const coords = {
        LON: { N: String(longitude) },
        LAT: { N: String(latitude) },
    };
    const geohash = ngeohash.encode(latitude, longitude, geohashLength);

    dql.updateUser(
        dynamodb,
        process.env.DB_UMT_001,
        hashKey,
        hashKey,
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
        callback
    );
};
