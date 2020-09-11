/**
 * Agrega un equipo
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


const aws = require('aws-sdk');
const umtEnvs = require('umt-envs');
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
	const name = event.name.toUpperCase().trim();

	// Elimina espacios y deja en minusculas el nombre del equipo
	const hashKey = `${umtEnvs.pfx.TEAM}${name.toLowerCase().replace(/\s+/g, '')}`;

	const picture = event.picture ? event.picture : '';
	const formation = event.formation ? JSON.parse(event.formation) :
		{'5v5': {S: '2-1-1'}, '7v7': {S: '3-2-1'}, '11v11': {S: '4-4-2'}};
	const searchingPlayers = String(event.searchingPlayers);
	const geohash = event.geohash;

	dql.addTeam(dynamodb, process.env.DB_UMT_001, hashKey, hashKey, geohash, name, picture,
		formation, searchingPlayers, callback);
};
