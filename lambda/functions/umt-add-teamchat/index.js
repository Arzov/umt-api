/**
 * Add a message into the team chat
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */

const aws = require('aws-sdk');
const umtEnvs = require('umt-envs');
const dql = require('utils/dql');
let options = umtEnvs.gbl.DYNAMODB_CONFIG;

if (process.env.RUN_MODE === 'LOCAL') options = umtEnvs.dev.DYNAMODB_CONFIG;

const dynamodb = new aws.DynamoDB(options);

exports.handler = function (event, context, callback) {
    const hashKey = `${umtEnvs.pfx.TEAM}${event.teamId}`;
    const sentOn = new Date().toISOString();
    const rangeKey = `${umtEnvs.pfx.CHAT}${sentOn}#${event.email}`;
    const msg = event.msg;

    dql.addTeamChat(
        dynamodb,
        process.env.DB_UMT_001,
        hashKey,
        rangeKey,
        msg,
        callback
    );
};
