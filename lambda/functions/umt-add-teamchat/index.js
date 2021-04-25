/**
 * Add a message into the team chat
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

    const hashKey = `${umtEnvs.pfx.TEAM}${event.teamId}`;
    const sentOn = new Date().toISOString();
    const rangeKey = `${umtEnvs.pfx.TEAM_CHAT}${sentOn}${event.email}`;
    const GSI1PK = `${umtEnvs.pfx.USER}${event.email}`;
    const GSI1SK = `${umtEnvs.pfx.TEAM_CHAT}${sentOn}`;
    const author = event.author;
    const msg = event.msg;

    let expireOn = new Date();
    expireOn.setDate(
        new Date().getDate() + umtEnvs.gbl.TEAMCHAT_DAYS_TO_EXPIRE
    );
    expireOn = expireOn.toISOString();

    dql.addTeamChat(
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
