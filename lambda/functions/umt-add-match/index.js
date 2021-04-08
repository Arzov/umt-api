/**
 * Create a match
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */

const aws = require('aws-sdk');
const umtEnvs = require('umt-envs');
const dql = require('utils/dql');
let optionsDynamodb = umtEnvs.gbl.DYNAMODB_CONFIG;
let optionsLambda = umtEnvs.gbl.LAMBDA_CONFIG;

if (process.env.RUN_MODE === 'LOCAL') {
    optionsDynamodb = umtEnvs.dev.DYNAMODB_CONFIG;
    optionsLambda = umtEnvs.dev.LAMBDA_CONFIG;
}

const dynamodb = new aws.DynamoDB(optionsDynamodb);
const lambda = new aws.Lambda(optionsLambda);

exports.handler = function (event, context, callback) {
    const hashKey = `${umtEnvs.pfx.TEAM}${event.teamId1}`;
    const rangeKey = `${umtEnvs.pfx.MATCH}${event.teamId2}`;
    const GSI1PK = `${umtEnvs.pfx.TEAM}${event.teamId2}`;
    const GSI1SK = `${umtEnvs.pfx.MATCH}${event.teamId1}`;
    const createdOn = new Date().toISOString();

    let expireOn = new Date();
    expireOn.setDate(new Date().getDate() + umtEnvs.gbl.MATCH_DAYS_TO_EXPIRE);
    expireOn = expireOn.toISOString();

    const patches = umtEnvs.dft.MATCH.PATCHES;
    const positions = umtEnvs.dft.MATCH.POSITIONS;
    const ageMinFilter = String(event.ageMinFilter);
    const ageMaxFilter = String(event.ageMaxFilter);
    const matchFilter = event.matchFilter;
    const schedule = expireOn;
    const geohash = event.geohash;
    const stadiumGeohash = umtEnvs.dft.MATCH.STADIUMGEOHASH;
    const stadiumId = umtEnvs.dft.MATCH.STADIUMID;
    const courtId = umtEnvs.dft.MATCH.COURTID;
    const genderFilter = event.genderFilter;
    const reqStat = umtEnvs.dft.MATCH.REQSTAT;
    const latitude = event.latitude;
    const longitude = event.longitude;

    const coords = {
        LON: { N: String(longitude) },
        LAT: { N: String(latitude) },
    };

    // Validate if already exist a request from the requested team
    let params = { FunctionName: 'umt-get-match' };

    params.Payload = JSON.stringify({
        teamId1: event.teamId2,
        teamId2: event.teamId1,
    });

    lambda.invoke(params, function (err, data) {
        if (err) callback(err);
        else {
            const response = JSON.parse(data.Payload);

            if (
                Object.entries(response).length > 0 &&
                response.constructor === Object &&
                createdOn < response.expireOn
            ) {
                const err = new Error(
                    JSON.stringify({
                        code: 'MatchExistException',
                        message: `Ya existe una solicitud desde el equipo rival.`,
                    })
                );
                callback(err);
            } else
                dql.addMatch(
                    dynamodb,
                    process.env.DB_UMT_001,
                    hashKey,
                    rangeKey,
                    createdOn,
                    expireOn,
                    patches,
                    positions,
                    ageMinFilter,
                    ageMaxFilter,
                    matchFilter,
                    schedule,
                    reqStat,
                    geohash,
                    coords,
                    stadiumGeohash,
                    stadiumId,
                    courtId,
                    genderFilter,
                    GSI1PK,
                    GSI1SK,
                    callback
                );
        }
    });
};
