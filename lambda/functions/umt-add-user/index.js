/**
 * Add user
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */

const aws = require('aws-sdk');
const umtEnvs = require('umt-envs');
const ngeohash = require('ngeohash');
const dql = require('utils/dql');
let options = umtEnvs.gbl.DYNAMODB_CONFIG;

if (process.env.RUN_MODE === 'LOCAL') options = umtEnvs.dev.DYNAMODB_CONFIG;

const dynamodb = new aws.DynamoDB(options);

exports.handler = function (event, context, callback) {
    const latitude = event.latitude;

    const longitude = event.longitude;

    const hashKey = `${umtEnvs.pfx.USER}${event.email}`;

    const rangeKey = `${umtEnvs.pfx.METADATA}${event.email}`;

    const ageMinFilter = String(event.ageMinFilter);

    const ageMaxFilter = String(event.ageMaxFilter);

    const matchFilter = event.matchFilter;

    const positions = event.positions
        ? event.positions
        : umtEnvs.dft.USER.POSITIONS;

    const skills = event.skills
        ? JSON.parse(event.skills)
        : umtEnvs.dft.USER.SKILLS;

    const foot = event.foot;

    const weight = String(event.weight);

    const height = String(event.height);

    const coords = {
        LON: { N: String(longitude) },
        LAT: { N: String(latitude) },
    };

    const geohash = ngeohash.encode(
        latitude,
        longitude,
        umtEnvs.gbl.GEOHASH_LENGTH
    );

    dql.addUser(
        dynamodb,
        process.env.DB_UMT_001,
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
        callback
    );
};
