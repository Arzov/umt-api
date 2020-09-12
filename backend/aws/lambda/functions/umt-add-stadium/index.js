/**
 * Agrega un club deportivo
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


const aws = require('aws-sdk');
const umtEnvs = require('umt-envs');
const ngeohash = require('ngeohash');
const umtUtils = require('umt-utils');
const dql = require('utils/dql');
const geohashLength = umtEnvs.gbl.GEOHASH_LENGTH;
let options = { apiVersion: '2012-08-10' };

if (process.env.RUN_MODE === 'LOCAL') {
	options.endpoint = 'http://arzov:8000';
	options.accessKeyId = 'xxxx';
	options.secretAccessKey = 'xxxx';
	options.region = 'localhost';
}

const dynamodb = new aws.DynamoDB(options);


exports.handler = function(event, context, callback) {
	const name = umtUtils.cleanName(event.name.toUpperCase().trim());
	const latitude = event.latitude;
	const longitude = event.longitude;
	const coords = {LON: {N: String(longitude)}, LAT: {N: String(latitude)}};
	const hashKey = `${umtEnvs.pfx.STAD}${umtUtils.nameToId(name)}`;
	const rangeKey = `${umtEnvs.pfx.STAD}${ngeohash.encode(latitude, longitude, geohashLength)}`;
	const matchTypes = event.matchTypes;
	const address = event.address ? event.address : '';

	dql.addStadium(dynamodb, process.env.DB_UMT_001, hashKey, rangeKey, name, matchTypes, coords,
		address, callback);
};
