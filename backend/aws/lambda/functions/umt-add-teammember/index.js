/**
 * Agrega un miembro en el equipo
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


const aws = require('aws-sdk');
const umtEnvs = require('umt-envs');
const moment = require('moment');
const dql = require('utils/dql');
let options = { apiVersion: '2012-08-10' };

if (process.env.RUN_MODE === 'LOCAL') {
	options.endpoint = 'http://arzov:8000';
	options.accessKeyId = 'xxxx';
	options.secretAccessKey = 'xxxx';
	options.region = 'localhost';
}

const dynamodb = new aws.DynamoDB(options);


exports.handler = function(event, context, callback) {
	const hashKey = `${umtEnvs.pfx.TEAM}${event.teamId}`;
	const rangeKey = `${umtEnvs.pfx.MEM}${event.userEmail}`;
	const position = event.position ? JSON.parse(event.position) : 
		{'5v5':{M:{P:{S:'GK'},X:{N:'-1'},Y:{N:'-1'}}},'7v7':{M:{P:{S:'GK'},X:{N:'-1'},Y:{N:'-1'}}},
		'11v11':{M:{P:{S:'GK'},X:{N:'-1'},Y:{N:'-1'}}}};
	const role = event.role ? event.role : ['Player'];
	const status = JSON.parse(event.status);
	const number = String(event.number);
	const joinedOn = moment().format();

	dql.addTeamMember(dynamodb, process.env.DB_UMT_001, hashKey, rangeKey, position, role,
		status, number, joinedOn, callback);
};
