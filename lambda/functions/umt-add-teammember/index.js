/**
 * Agrega un miembro en el equipo
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


const aws = require('aws-sdk');
const umtEnvs = require('umt-envs');
const moment = require('moment');
const dql = require('utils/dql');
let options = umtEnvs.gbl.DYNAMODB_CONFIG;

if (process.env.RUN_MODE === 'LOCAL') options = umtEnvs.dev.DYNAMODB_CONFIG;

const dynamodb = new aws.DynamoDB(options);


exports.handler = function(event, context, callback) {
	const hashKey = `${umtEnvs.pfx.TEAM}${event.teamId}`;
	const rangeKey = `${umtEnvs.pfx.MEM}${event.userEmail}`;
	const position = umtEnvs.dft.TEAMMEMBER.POSITION;
	const role = event.role ? event.role : umtEnvs.dft.TEAMMEMBER.ROLE;
	const reqStat = JSON.parse(event.reqStat);
	const number = umtEnvs.dft.TEAMMEMBER.NUMBER;
	const joinedOn = moment().format();

	dql.addTeamMember(dynamodb, process.env.DB_UMT_001, hashKey, rangeKey, position, role,
		reqStat, number, joinedOn, callback);
};
