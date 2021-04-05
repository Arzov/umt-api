/**
 * Get active team/patch matches
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */

const aws = require('aws-sdk');
const umtEnvs = require('umt-envs');
const dql = require('utils/dql');

let limitScan = umtEnvs.gbl.MATCHES_SCAN_LIMIT;
let optionsDynamodb = umtEnvs.gbl.DYNAMODB_CONFIG;
let optionsLambda = umtEnvs.gbl.LAMBDA_CONFIG;

if (process.env.RUN_MODE === 'LOCAL') {
    optionsDynamodb = umtEnvs.dev.DYNAMODB_CONFIG;
    optionsLambda = umtEnvs.dev.LAMBDA_CONFIG;
    limitScan = umtEnvs.dev.MATCHES_SCAN_LIMIT;
}

const lambda = new aws.Lambda(optionsLambda);
const dynamodb = new aws.DynamoDB(optionsDynamodb);

/**
 * Get match info for a list of matches
 * @param {Object} lambda Lambda client
 * @param {Object} data List of matches
 * @param {Function} fn Callback
 */
const getMatches = async (lambda, data, fn) => {
    const matches = [];
    let params = { FunctionName: 'umt-get-match' };

    for (const e in data.Items) {
        params.Payload = JSON.stringify({
            teamId1: data.Items[e].hashKey.S.split('#')[1],
            teamId2: data.Items[e].hashKey.S.split('#')[2],
        });

        matches.push(
            await new Promise((resolve) => {
                lambda.invoke(params, function (err, data) {
                    if (err) fn(err);
                    else resolve(JSON.parse(data.Payload));
                });
            })
        );
    }

    return matches;
};

exports.handler = (event, context, callback) => {
    const hashKey = `${umtEnvs.pfx.TEAM}${event.id}`;

    const GSI1PK = `${umtEnvs.pfx.USER}${event.email}`;

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
            function (err, data) {
                if (err) callback(err);
                else {
                    let ownerNextTokenResult = null;
                    let guestNextTokenResult = null;
                    let ownerDataResult = [];
                    let guestDataResult = [];

                    ownerNextTokenResult = data.LastEvaluatedKey;
                    ownerDataResult = data.Items;

                    dql.listGuestMatches(
                        dynamodb,
                        process.env.DB_UMT_001,
                        hashKey,
                        limitScan,
                        guestNextToken,
                        function (err, data) {
                            if (err) callback(err);
                            else {
                                guestNextTokenResult = data.LastEvaluatedKey;
                                guestDataResult = data.Items;

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
            GSI1PK,
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
