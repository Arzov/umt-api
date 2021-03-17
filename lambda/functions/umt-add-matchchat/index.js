/**
 * Add message into the match chat
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */

const aws = require('aws-sdk');
const umtEnvs = require('umt-envs');
const dql = require('utils/dql');
let options = umtEnvs.gbl.DYNAMODB_CONFIG;

if (process.env.RUN_MODE === 'LOCAL') options = umtEnvs.dev.DYNAMODB_CONFIG;

const dynamodb = new aws.DynamoDB(options);

exports.handler = function (event, context, callback) {
    const hashKey = `${umtEnvs.pfx.MATCH}${event.teamId1}#${event.teamId2}`;
    const sentOn = new Date().toISOString();
    const rangeKey = `${umtEnvs.pfx.CHAT}${sentOn}#${event.userEmail}`;
    const msg = event.msg;

    dql.addMatchChat(
        dynamodb,
        process.env.DB_UMT_001,
        hashKey,
        rangeKey,
        msg,
        callback
    );
};
