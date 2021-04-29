/**
 * Update team member
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

    const hashKey = `${umtEnvs.pfx.TEAM}${event.teamId}`;
    const rangeKey = `${umtEnvs.pfx.TEAM_MEMBER}${event.email}`;
    const name = event.name;
    const position = JSON.parse(event.position);
    const role = event.role;
    const reqStat = JSON.parse(event.reqStat);
    const number = String(event.number);


    // get team member to compare request status

    let params = { FunctionName: 'umt-get-teammember' };

    params.Payload = JSON.stringify({
        teamId  : event.teamId,
        email   : event.email
    });

    lambda.invoke(params, function (err, data) {

        if (err) callback(err);

        else {

            const response = JSON.parse(data.Payload);
            const isEmpty = umtUtils.isObjectEmpty(response);


            // the request still exist

            if (!isEmpty) {


                // delete the request if it's cancelled

                if (reqStat.PR.S === 'C' || reqStat.TR.S === 'C')
                    dql.deleteTeamMember(
                        dynamodb,
                        process.env.DB_UMT_001,
                        hashKey,
                        rangeKey,
                        callback
                    );


                // update request

                else
                    dql.updateTeamMember(
                        dynamodb,
                        process.env.DB_UMT_001,
                        hashKey,
                        rangeKey,
                        name,
                        position,
                        role,
                        number,
                        reqStat,
                        callback
                    );
            }


            // the request no longer exist

            else {
                const err = new Error(
                    JSON.stringify({
                        code    : 'TeamMemberNotExistException',
                        message : `La solicitud ya no existe.`,
                    })
                );

                callback(err);
            }
        }
    });
};
