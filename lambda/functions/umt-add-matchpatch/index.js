/**
 * Add a patch into the match
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
    const hashKey = `${umtEnvs.pfx.MATCH}${event.teamId1}#${event.teamId2}`;
    const rangeKey = `${umtEnvs.pfx.MATCH_PATCH}${event.email}`;
    const joinedOn = new Date().toISOString();
    const reqStat = JSON.parse(event.reqStat);
    const expireOn = event.expireOn;
    const GSI1PK = `${umtEnvs.pfx.USER}${event.email}`;

    // Validate if the patch player is already in the match
    if (reqStat.PR.S === 'P') {
        let params = { FunctionName: 'umt-get-matchpatch' };

        params.Payload = JSON.stringify({
            teamId1: event.teamId1,
            teamId2: event.teamId2,
            email: event.email,
        });

        lambda.invoke(params, function (err, data) {
            if (err) callback(err);
            else {
                const response = JSON.parse(data.Payload);

                if (
                    Object.entries(response).length > 0 &&
                    response.constructor === Object
                ) {
                    let err = new Error(
                        JSON.stringify({
                            code: 'MatchPatchExistsException',
                            message: `El jugador ya participa del partido.`,
                        })
                    );
                    callback(err);
                } else
                    dql.addMatchPatch(
                        dynamodb,
                        process.env.DB_UMT_001,
                        hashKey,
                        rangeKey,
                        joinedOn,
                        reqStat,
                        expireOn,
                        GSI1PK,
                        callback
                    );
            }
        });
    } else
        dql.addMatchPatch(
            dynamodb,
            process.env.DB_UMT_001,
            hashKey,
            rangeKey,
            joinedOn,
            reqStat,
            expireOn,
            GSI1PK,
            callback
        );
};
