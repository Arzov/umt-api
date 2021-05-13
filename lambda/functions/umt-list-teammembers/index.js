/**
 * Get team's members
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


// packages

const umtEnvs = require('umt-envs');
const aws = require('aws-sdk');
const dql = require('utils/dql');


// configurations

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


// execution

exports.handler = (event, context, callback) => {

    const hashKey = `${umtEnvs.pfx.TEAM}${event.teamId}`;
    const nextToken = event.nextToken;

    dql.listTeamMembers(
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

                    let params = { FunctionName: 'umt-get-teammember' };
                    const teamMembers = [];


                    // get information of each team's member

                    for (const teamMember of data.Items) {

                        params.Payload = JSON.stringify({
                            teamId  : teamMember.hashKey.S.split('#')[1],
                            email   : teamMember.rangeKey.S.split('#')[1]
                        });


                        teamMembers.push(
                            await new Promise((resolve) => {

                                lambda.invoke(params, function (err, data) {
                                    if (err) callback(err);
                                    else resolve(JSON.parse(data.Payload));
                                });

                            })
                        );
                    }

                    dataResult = teamMembers;

                }

                callback(null, {
                    items       : dataResult,
                    nextToken   : nextTokenResult,
                });

            }

        }

    );

};
