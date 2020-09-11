/**
 * Un parche se une al match
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
	const hashKey = `${umtEnvs.pfx.MATCH}${event.teamId1}`;
	const rangeKey = `${umtEnvs.pfx.PATCH}${event.teamId2}#${event.userEmail}`;
	const joinedOn = moment().format();
	const status = event.status ? JSON.parse(event.status) : {PS:{S:'P'}};

    dql.addMatchPatch(dynamodb, process.env.DB_UMT_001, hashKey, rangeKey, joinedOn, status, callback);
};
