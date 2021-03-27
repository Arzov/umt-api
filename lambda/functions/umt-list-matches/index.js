/**
 * Get active team/player matches
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */

const aws = require('aws-sdk');
const umtEnvs = require('umt-envs');
const dql = require('utils/dql');
let optionsDynamodb = umtEnvs.gbl.DYNAMODB_CONFIG;
let optionsLambda = umtEnvs.gbl.LAMBDA_CONFIG;
let limitScan = umtEnvs.gbl.MATCHES_SCAN_LIMIT;

if (process.env.RUN_MODE === 'LOCAL') {
    optionsDynamodb = umtEnvs.dev.DYNAMODB_CONFIG;
    optionsLambda = umtEnvs.dev.LAMBDA_CONFIG;
    limitScan = umtEnvs.dev.MATCHES_SCAN_LIMIT;
}

const lambda = new aws.Lambda(optionsLambda);
const dynamodb = new aws.DynamoDB(optionsDynamodb);
const getMatches = async (
    lambda,
    data,
    hashKey,
    rangeKey,
    idx1,
    idx2,
    callback
) => {
    const matches = [];
    let params = { FunctionName: 'umt-get-match' };

    for (const e in data.Items) {
        params.Payload = JSON.stringify({
            teamId1: data.Items[e][hashKey].S.split('#')[idx1],
            teamId2: data.Items[e][rangeKey].S.split('#')[idx2],
        });

        matches.push(
            await new Promise((resolve) => {
                lambda.invoke(params, function (err, data) {
                    if (err) callback(err);
                    else resolve(JSON.parse(data.Payload));
                });
            })
        );
    }

    return matches;
};

exports.handler = (event, context, callback) => {
    const hashKey = `${umtEnvs.pfx.MATCH}${event.id}`;
    const rangeKey = `${umtEnvs.pfx.PATCH}${event.email}`;
    const ownerNextToken = event.nextToken
        ? event.nextToken.split('&')[0]
        : null;
    const guestNextToken = event.nextToken
        ? event.nextToken.split('&')[1]
        : null;
    const patchNextToken = event.nextToken;

    if (event.id) {
        dql.listOwnerMatches(
            dynamodb,
            process.env.DB_UMT_001,
            hashKey,
            limitScan,
            ownerNextToken,
            async function (err, data) {
                if (err) callback(err);
                else {
                    let ownerNextTokenResult = null;
                    let guestNextTokenResult = null;
                    let ownerDataResult = [];
                    let guestDataResult = [];

                    if ('LastEvaluatedKey' in data)
                        ownerNextTokenResult = JSON.stringify(
                            data.LastEvaluatedKey
                        );

                    if (data.Count) {
                        ownerDataResult = await getMatches(
                            lambda,
                            data,
                            'hashKey',
                            'rangeKey',
                            1,
                            1,
                            callback
                        );
                    }

                    dql.listGuestMatches(
                        dynamodb,
                        process.env.DB_UMT_001,
                        hashKey,
                        limitScan,
                        guestNextToken,
                        async function (err, data) {
                            if (err) callback(err);
                            else {
                                if ('LastEvaluatedKey' in data)
                                    guestNextTokenResult = JSON.stringify(
                                        data.LastEvaluatedKey
                                    );

                                if (data.Count) {
                                    guestDataResult = await getMatches(
                                        lambda,
                                        data,
                                        'hashKey',
                                        'rangeKey',
                                        1,
                                        1,
                                        callback
                                    );
                                }

                                ownerNextTokenResult = ownerNextTokenResult
                                    ? ownerNextTokenResult
                                    : '';
                                guestNextTokenResult = guestNextTokenResult
                                    ? guestNextTokenResult
                                    : '';

                                callback(null, {
                                    items: ownerDataResult.concat(
                                        guestDataResult
                                    ),
                                    nextToken: `${ownerNextTokenResult}&${guestNextTokenResult}`,
                                });
                            }
                        }
                    );
                }
            }
        );
    } else
        dql.listPatchMatches(
            dynamodb,
            process.env.DB_UMT_001,
            rangeKey,
            limitScan,
            patchNextToken,
            async function (err, data) {
                if (err) callback(err);
                else {
                    let patchNextTokenResult = null;
                    let patchDataResult = [];

                    if ('LastEvaluatedKey' in data)
                        patchNextTokenResult = JSON.stringify(
                            data.LastEvaluatedKey
                        );

                    if (data.Count) {
                        patchDataResult = await getMatches(
                            lambda,
                            data,
                            'hashKey',
                            'hashKey',
                            1,
                            2,
                            callback
                        );
                    }

                    callback(null, {
                        items: patchDataResult,
                        nextToken: patchNextTokenResult,
                    });
                }
            }
        );
};
