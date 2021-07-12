/**
 * Add a team member
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


// packages

const umtEnvs = require('umt-envs');
const aws = require('aws-sdk');
const dql = require('utils/dql');
const fns = require('utils/fns');


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

exports.handler = async (event) => {

    const hashKey = `${umtEnvs.pfx.TEAM}${event.teamId}`;
    const rangeKey = `${umtEnvs.pfx.TEAM_MEMBER}${event.email}`;
    const position = umtEnvs.dft.TEAM_MEMBER.POSITION;
    const role = event.role ? event.role : umtEnvs.dft.TEAM_MEMBER.ROLE;
    const reqStat = JSON.parse(event.reqStat);
    const number = umtEnvs.dft.TEAM_MEMBER.NUMBER;
    const joinedOn = new Date().toISOString();
    const GSI1PK = `${umtEnvs.pfx.USER}${event.email}`;
    const name = event.name;


    // check if the player already belong to the team

    const belongToTeam = await fns.belongToTeam(lambda, event.teamId, event.email);

    if (belongToTeam) {

        err = new Error(JSON.stringify({
            code    : 'TeamMemberExistException',
            message : `El jugador ya pertenece al equipo.`,
        }));

        throw err;

    }


    // add team member request

    else {

        return await dql.addTeamMember(
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
            name
        );

    }

};
