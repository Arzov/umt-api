/**
 * Add message into the match chat
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


// packages

const umtEnvs = require('umt-envs');
const aws = require('aws-sdk');
const dql = require('utils/dql');


// configurations

let options = umtEnvs.gbl.DYNAMODB_CONFIG;

if (process.env.RUN_MODE === 'LOCAL') options = umtEnvs.dev.DYNAMODB_CONFIG;

const dynamodb = new aws.DynamoDB(options);


// execution

exports.handler = function (event, context, callback) {

    const hashKey = `${umtEnvs.pfx.MATCH}${event.teamId1}#${event.teamId2}`;
    const sentOn = new Date().toISOString();
    const rangeKey = `${umtEnvs.pfx.MATCH_CHAT}${sentOn}#${event.email}`;
    const author = event.author;
    const msg = event.msg;
    const expireOn = event.expireOn;
    const GSI1PK = `${umtEnvs.pfx.USER}${event.email}`;
    const GSI1SK = `${umtEnvs.pfx.MATCH_CHAT}${sentOn}`;

    dql.addMatchChat(
        dynamodb,
        process.env.DB_UMT_001,
        hashKey,
        rangeKey,
        author,
        msg,
        expireOn,
        GSI1PK,
        GSI1SK,
        sentOn,
        callback
    );
};
