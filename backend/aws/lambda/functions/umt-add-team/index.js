/**
 * Agrega un equipo
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


const aws = require('aws-sdk');
const umtEnvs = require('umt-envs');
const dql = require('utils/dql');
const umtUtils = require('umt-utils');
let options = umtEnvs.gbl.DYNAMODB_CONFIG;

if (process.env.RUN_MODE === 'LOCAL') options = umtEnvs.dev.DYNAMODB_CONFIG;

const dynamodb = new aws.DynamoDB(options);


exports.handler = function(event, context, callback) {
	const name = umtUtils.cleanName(event.name);
	const hashKey = `${umtEnvs.pfx.TEAM}${umtUtils.nameToId(name)}`;
	const picture = event.picture ? event.picture : umtEnvs.dft.TEAM.PICTURE;
	const formation = event.formation ? JSON.parse(event.formation) : umtEnvs.dft.TEAM.FORMATION;
	const searchingPlayers = event.searchingPlayers;
	const geohash = event.geohash;

	dql.addTeam(dynamodb, process.env.DB_UMT_001, hashKey, hashKey, geohash, name, picture,
		formation, searchingPlayers, callback);
};
