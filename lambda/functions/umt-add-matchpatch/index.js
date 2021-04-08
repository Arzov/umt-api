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

// Add player into the match and update the match
const upsertMatchPatch = (
    dynamodb,
    lambda,
    match,
    patches,
    hashKey,
    rangeKey,
    joinedOn,
    reqStat,
    expireOn,
    GSI1PK,
    callback
) => {
    patches.CP.N = String(patches.CP.N);
    patches.NP.N = String(patches.NP.N);

    let params = {
        FunctionName: 'umt-update-match',
    };

    params.Payload = JSON.stringify({
        teamId1: match.teamId1,
        teamId2: match.teamId2,
        patches: JSON.stringify(patches),
        positions: match.positions,
        matchFilter: match.matchFilter,
        ageMinFilter: match.ageMinFilter,
        ageMaxFilter: match.ageMaxFilter,
        schedule: match.schedule,
        reqStat: match.reqStat,
        stadiumGeohash: match.stadiumGeohash,
        stadiumId: match.stadiumId,
        courtId: match.courtId,
        genderFilter: match.genderFilter,
    });

    lambda.invoke(params, function (err, data) {
        if (err) callback(err);
        else {
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
};

exports.handler = function (event, context, callback) {
    const hashKey = `${umtEnvs.pfx.MATCH}${event.teamId1}#${event.teamId2}`;
    const rangeKey = `${umtEnvs.pfx.MATCH_PATCH}${event.email}`;
    const joinedOn = new Date().toISOString();
    const reqStat = JSON.parse(event.reqStat);
    const expireOn = event.expireOn;
    const GSI1PK = `${umtEnvs.pfx.USER}${event.email}`;

    // Validate first if the player already has a request in the match
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

            let existRequest = false;
            let existingReqStat = null;

            if (
                Object.entries(response).length > 0 &&
                response.constructor === Object
            ) {
                existRequest = true;
                existingReqStat = JSON.parse(response.reqStat);
            }

            // Request from match to player
            if (reqStat.PR.S === 'P') {
                if (existRequest) {
                    let err = new Error(
                        JSON.stringify({
                            code: 'MatchPatchExistException',
                            message: `El jugador ya participa del partido.`,
                        })
                    ); // default case of player already in the match

                    if (existingReqStat.PR.S == 'P')
                        err = new Error(
                            JSON.stringify({
                                code: 'MatchPatchRequestException',
                                message: `Ya existe una solicitud para el jugador.`,
                            })
                        ); // player doesn't accept request from match yet

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

            // Request from player to match
            else {
                let params = { FunctionName: 'umt-get-match' };

                params.Payload = JSON.stringify({
                    teamId1: event.teamId1,
                    teamId2: event.teamId2,
                });

                lambda.invoke(params, function (err, data) {
                    if (err) callback(err);
                    else {
                        const response = JSON.parse(data.Payload);
                        let patches = JSON.parse(response.patches);

                        patches.CP.N = Number(patches.CP.N);
                        patches.NP.N = Number(patches.NP.N);

                        // Player already has a request (pending or accepted)
                        if (existRequest) {
                            /**
                             * Increse the number of patches. This condition
                             * `existingReqStat.PR.S == 'P'` means that the
                             * player is accepting the request from the match.
                             * So in this case we need to increase the number
                             * of patches as well (CP and NP).
                             */
                            if (existingReqStat.PR.S == 'P') {
                                patches.CP.N += 1;
                                patches.NP.N += 1;

                                upsertMatchPatch(
                                    dynamodb,
                                    lambda,
                                    response,
                                    patches,
                                    hashKey,
                                    rangeKey,
                                    joinedOn,
                                    reqStat,
                                    expireOn,
                                    GSI1PK,
                                    callback
                                );
                            }

                            // Player already in the match
                            else {
                                const err = new Error(
                                    JSON.stringify({
                                        code: 'MatchPatchExistException',
                                        message: `El jugador ya participa del partido.`,
                                    })
                                );

                                callback(err);
                            }
                        }

                        // Check if the patches vacancy are not full
                        if (patches.CP.N >= patches.NP.N) {
                            const err = new Error(
                                JSON.stringify({
                                    code: 'MatchPatchFullException',
                                    message: `No quedan cupos en el partido.`,
                                })
                            );

                            callback(err);
                        }

                        // Add player into the match
                        else {
                            patches.CP.N += 1;

                            upsertMatchPatch(
                                dynamodb,
                                lambda,
                                response,
                                patches,
                                hashKey,
                                rangeKey,
                                joinedOn,
                                reqStat,
                                expireOn,
                                GSI1PK,
                                callback
                            );
                        }
                    }
                });
            }
        }
    });
};
