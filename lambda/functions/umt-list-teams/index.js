/**
 * Obtiene equipos al que pertenece el usuario
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


const aws = require('aws-sdk');
const umtEnvs = require('umt-envs');
const dql = require('utils/dql');
let optionsDynamodb = umtEnvs.gbl.DYNAMODB_CONFIG;
let optionsLambda = umtEnvs.gbl.LAMBDA_CONFIG;

if (process.env.RUN_MODE === 'LOCAL') {
    optionsDynamodb = umtEnvs.dev.DYNAMODB_CONFIG;
    optionsLambda = umtEnvs.dev.LAMBDA_CONTAINER_CONFIG;
}

const lambda = new aws.Lambda(optionsLambda)
const dynamodb = new aws.DynamoDB(optionsDynamodb);
const limitScan = umtEnvs.gbl.TEAMS_SCAN_LIMIT;


exports.handler = (event, context, callback) => {
    const rangeKey = `${umtEnvs.pfx.MEM}${event.email}`;
    const nextToken = event.nextToken;

    dql.listTeams(dynamodb, process.env.DB_UMT_001, rangeKey, limitScan, nextToken,
        async function(err, data) {
        if (err) callback(err);
        else {
            let nextTokenResult = null;
            let dataResult = null;

            if ('LastEvaluatedKey' in data)
                nextTokenResult = JSON.stringify(data.LastEvaluatedKey);

            if (data.Count) {
                const teams = [];
                let params = { FunctionName: 'umt-get-team' };

                for (const e in data.Items) {
                    params.Payload = JSON.stringify({
                        id: data.Items[e].hashKey.S.split('#')[1]
                    });

                    teams.push(await new Promise(resolve => {
                        lambda.invoke(params, function(err, data) {
                            if (err) callback(err);
                            else resolve(JSON.parse(data.Payload));
                        })
                    }));
                }

                dataResult = teams
            }

            callback(null, {
                items: dataResult,
                nextToken: nextTokenResult
            });
        }
    });
};
