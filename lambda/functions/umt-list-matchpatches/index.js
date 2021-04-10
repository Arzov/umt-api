/**
 * Get active match's patches
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */

const umtEnvs = require('umt-envs');
const aws = require('aws-sdk');
const dql = require('utils/dql');

let optionsDynamodb = umtEnvs.gbl.DYNAMODB_CONFIG;
let optionsLambda = umtEnvs.gbl.LAMBDA_CONFIG;
let limitScan = umtEnvs.gbl.SCAN_LIMIT;

if (process.env.RUN_MODE === 'LOCAL') {
    optionsDynamodb = umtEnvs.dev.DYNAMODB_CONFIG;
    optionsLambda = umtEnvs.dev.LAMBDA_CONFIG;
    limitScan = umtEnvs.dev.SCAN_LIMIT;
}

const lambda = new aws.Lambda(optionsLambda);
const dynamodb = new aws.DynamoDB(optionsDynamodb);

exports.handler = (event, context, callback) => {
    const hashKey = `${umtEnvs.pfx.MATCH}${event.teamId1}#${event.teamId2}`;
    const nextToken = event.nextToken;

    dql.listMatchPatches(
        dynamodb,
        process.env.DB_UMT_001,
        hashKey,
        limitScan,
        nextToken,
        async function (err, data) {
            if (err) callback(err);
            else {
                let nextTokenResult = null;
                let dataResult = null;

                if ('LastEvaluatedKey' in data)
                    nextTokenResult = JSON.stringify(data.LastEvaluatedKey);

                if (data.Count) {
                    const matchPatches = [];
                    let params = { FunctionName: 'umt-get-matchpatch' };

                    for (const e in data.Items) {
                        params.Payload = JSON.stringify({
                            teamId1: event.teamId1,
                            teamId2: event.teamId2,
                            email: data.Items[e].rangeKey.S.split('#')[1],
                        });

                        matchPatches.push(
                            await new Promise((resolve) => {
                                lambda.invoke(params, function (err, data) {
                                    if (err) callback(err);
                                    else resolve(JSON.parse(data.Payload));
                                });
                            })
                        );
                    }

                    dataResult = matchPatches;
                }

                callback(null, {
                    items: dataResult,
                    nextToken: nextTokenResult,
                });
            }
        }
    );
};
