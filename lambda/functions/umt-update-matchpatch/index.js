/**
 * Update patch in a match
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


// packages

const umtEnvs = require('umt-envs');
const umtUtils = require('umt-utils');
const aws = require('aws-sdk');
const dql = require('utils/dql');


// configurations

let optionsDynamodb = umtEnvs.gbl.DYNAMODB_CONFIG;
let optionsLambda = umtEnvs.gbl.LAMBDA_CONFIG;

if (process.env.RUN_MODE === 'LOCAL') {
    optionsDynamodb = umtEnvs.dev.DYNAMODB_CONFIG;
    optionsLambda = umtEnvs.dev.LAMBDA_CONFIG;
}

const dynamodb = new aws.DynamoDB(optionsDynamodb);
const lambda = new aws.Lambda(optionsLambda);


// execution

exports.handler = function (event, context, callback) {

    const hashKey = `${umtEnvs.pfx.MATCH}${event.teamId1}#${event.teamId2}`;
    const rangeKey = `${umtEnvs.pfx.MATCH_PATCH}${event.email}`;
    const name = event.name;
    const reqStat = JSON.parse(event.reqStat);
    const currDate = new Date().toISOString();


    let params = { FunctionName: 'umt-get-matchpatch' };

    params.Payload = JSON.stringify({
        teamId1 : event.teamId1,
        teamId2 : event.teamId2,
        email   : event.email
    });


    lambda.invoke(params, function (err, data) {
        if (err) callback(err);
        else {
            const response = JSON.parse(data.Payload);
            const isEmpty = umtUtils.isObjectEmpty(response);


            // the match still exist

            if (!isEmpty) {
                if (
                    reqStat.MR.S === 'C' ||
                    reqStat.PR.S === 'C' ||
                    currDate >= response.expireOn
                )
                    dql.deleteMatchPatch(
                        dynamodb,
                        process.env.DB_UMT_001,
                        hashKey,
                        rangeKey,
                        callback
                    );
                else
                    dql.updateMatchPatch(
                        dynamodb,
                        process.env.DB_UMT_001,
                        hashKey,
                        rangeKey,
                        name,
                        reqStat,
                        callback
                    );
            }


            // the match doesn't exist

            else {
                const err = new Error(
                    JSON.stringify({
                        code    : 'MatchNotExistException',
                        message : `El partido no existe.`,
                    })
                );
                callback(err);
            }
        }
    });
};
