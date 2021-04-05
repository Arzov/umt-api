/**
 * Add a team member
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
    const rangeKey = `${umtEnvs.pfx.TEAM_MEMBER}${event.email}`;
    const position = umtEnvs.dft.TEAM_MEMBER.POSITION;
    const role = event.role ? event.role : umtEnvs.dft.TEAM_MEMBER.ROLE;
    const reqStat = JSON.parse(event.reqStat);
    const number = umtEnvs.dft.TEAM_MEMBER.NUMBER;
    const joinedOn = new Date().toISOString();
    const GSI1PK = `${umtEnvs.pfx.USER}${event.email}`;

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
        callback
    );
};
