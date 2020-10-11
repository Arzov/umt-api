/**
 * Agrega un mensaje en el chat del equipo
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
	const sentOn = moment().format();
	const rangeKey = `${umtEnvs.pfx.CHAT}${sentOn}#${event.userEmail}`;
	const msg = event.msg;

	dql.addTeamChat(dynamodb, process.env.DB_UMT_001, hashKey, rangeKey, msg, callback);
};
