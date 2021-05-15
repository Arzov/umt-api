/**
 * Add a team member
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
    const rangeKey = `${umtEnvs.pfx.TEAM_MEMBER}${event.email}`;
    const position = umtEnvs.dft.TEAM_MEMBER.POSITION;
    const role = event.role ? event.role : umtEnvs.dft.TEAM_MEMBER.ROLE;
    const reqStat = JSON.parse(event.reqStat);
    const number = umtEnvs.dft.TEAM_MEMBER.NUMBER;
    const joinedOn = new Date().toISOString();
    const GSI1PK = `${umtEnvs.pfx.USER}${event.email}`;
    const name = event.name;


    // TODO: check if the player already belong to the team

    dql.addTeamMember(
        dynamodb,
        process.env.DB_UMT_001,
        hashKey,
        rangeKey,
        position,
        role,
        reqStat,
        number,
        joinedOn,
        GSI1PK,
        name,
        callback
    );
};
