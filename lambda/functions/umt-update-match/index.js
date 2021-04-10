/**
 * Update match
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */

const umtEnvs = require('umt-envs');
const umtUtils = require('umt-utils');
const aws = require('aws-sdk');
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
    const patches = JSON.parse(event.patches);
    const positions = event.positions;
    const matchFilter = event.matchFilter;
    const schedule = event.schedule;
    const reqStat = JSON.parse(event.reqStat);
    const stadiumGeohash = event.stadiumGeohash;
    const stadiumId = event.stadiumId;
    const courtId = String(event.courtId);
    const genderFilter = event.genderFilter;
    const ageMinFilter = String(event.ageMinFilter);
    const ageMaxFilter = String(event.ageMaxFilter);
    const currDate = new Date().toISOString();

    let params = { FunctionName: 'umt-get-match' };
    params.Payload = JSON.stringify({
        teamId1: event.teamId1,
        teamId2: event.teamId2,
    });
    lambda.invoke(params, function (err, data) {
        if (err) callback(err);
        else {
            const response = JSON.parse(data.Payload);
            const isEmpty = umtUtils.isObjectEmpty(response);

            // The match still exist
            if (!isEmpty) {
                if (
                    reqStat.AR.S === 'C' ||
                    reqStat.AR.S === 'D' ||
                    reqStat.RR.S === 'C' ||
                    reqStat.RR.S === 'D' ||
                    currDate >= response.expireOn
                )
                    dql.deleteMatch(
                        dynamodb,
                        process.env.DB_UMT_001,
                        hashKey,
                        rangeKey,
                        callback
                    );
                else
                    dql.updateMatch(
                        dynamodb,
                        process.env.DB_UMT_001,
                        hashKey,
                        rangeKey,
                        patches,
                        positions,
                        matchFilter,
                        schedule,
                        reqStat,
                        stadiumGeohash,
                        stadiumId,
                        courtId,
                        genderFilter,
                        ageMinFilter,
                        ageMaxFilter,
                        response.geohash,
                        response.coords,
                        callback
                    );
            }

            // The match doesn't exist
            else {
                const err = new Error(
                    JSON.stringify({
                        code: 'MatchNotExistException',
                        message: `El partido no existe.`,
                    })
                );
                callback(err);
            }
        }
    });
};
