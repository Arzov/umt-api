/**
 * Get active team/patch matches
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


// packages

const umtEnvs = require('umt-envs');
const aws = require('aws-sdk');
const dql = require('utils/dql');
const fns = require('utils/fns');


// configurations

let limitScan = umtEnvs.gbl.SCAN_LIMIT;
let optionsDynamodb = umtEnvs.gbl.DYNAMODB_CONFIG;
let optionsLambda = umtEnvs.gbl.LAMBDA_CONFIG;

if (process.env.RUN_MODE === 'LOCAL') {
    optionsDynamodb = umtEnvs.dev.DYNAMODB_CONFIG;
    optionsLambda = umtEnvs.dev.LAMBDA_CONFIG;
    limitScan = umtEnvs.dev.SCAN_LIMIT;
}

const lambda = new aws.Lambda(optionsLambda);
const dynamodb = new aws.DynamoDB(optionsDynamodb);


// execution

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


    // get team's actives matches

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
    }


    // get player's actives matches

    else
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
                        patchDataResult = await fns.getMatches(
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
