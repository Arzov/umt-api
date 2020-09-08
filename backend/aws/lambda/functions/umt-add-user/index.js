/**
 * Agrega un usuario
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


const aws = require('aws-sdk');
const umtEnvs = require('umt-envs');
const ngeohash = require('ngeohash');
const dql = require('utils/dql');
const geohashLength = 6;
let options = { apiVersion: '2012-08-10' };

if (process.env.RUN_MODE === 'LOCAL') {
	options.endpoint = 'http://arzov:8000';
	options.accessKeyId = 'xxxx';
	options.secretAccessKey = 'xxxx';
	options.region = 'localhost';
}

const dynamodb = new aws.DynamoDB(options);


exports.handler = function(event, context, callback) {
	const latitude = event.latitude;
	const longitude = event.longitude;
	const hashKey = `${umtEnvs.pfx.USR}${event.email}`;
	const genderFilter = event.genderFilter;
	const ageMinFilter = String(event.ageMinFilter);
	const ageMaxFilter = String(event.ageMaxFilter);
	const matchFilter = event.matchFilter;
	const positions = event.positions ? event.positions : [''];
	const skills = event.skills ? JSON.parse(event.skills):
		{ATT: {N: '1'}, SPD: {N: '1'}, TEC: {N: '1'}, TWK: {N: '1'}, FCE: {N: '1'}, DEF: {N: '1'}};
	const foot = event.foot ? event.foot : '';
	const weight = String(event.weight);
	const height = String(event.height);
	const coords = {LON: {N: String(longitude)}, LAT: {N: String(latitude)}};
	const geohash = ngeohash.encode(latitude, longitude, geohashLength);

	dql.addUser(dynamodb, process.env.DB_UMT_001, hashKey, hashKey, geohash, coords, genderFilter,
		ageMinFilter, ageMaxFilter, matchFilter, positions, skills, foot, weight, height, callback);
};
