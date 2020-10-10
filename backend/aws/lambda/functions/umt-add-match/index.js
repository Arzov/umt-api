/**
 * Crea un match entre equipos
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
const daysToExpire = umtEnvs.gbl.DAYS_TO_EXPIRE;


exports.handler = function(event, context, callback) {
	const hashKey = `${umtEnvs.pfx.MATCH}${event.teamId1}`;
	const rangeKey = `${umtEnvs.pfx.MATCH}${event.teamId2}`;
	const createdOn = moment().format();
	const expireOn = moment().add(daysToExpire, 'days').format();
	const allowedPatches = String(event.allowedPatches);
	const positions = event.positions ? event.positions : umtEnvs.dft.MATCH.POSITIONS;
	const matchTypes = event.matchTypes;
	// TODO: Revisar tiempo local vs tiempo del servidor (por lado del cliente en frontend)
	const schedule = event.schedule? JSON.parse(event.schedule) :
		{day: {S: expireOn.split('T')[0]}, time: {S: expireOn.split('T')[1].substr(0, 5)}};
	const geohash = event.geohash;
	const stadiumGeohash = event.stadiumGeohash ? event.stadiumGeohash : umtEnvs.dft.MATCH.STADIUMGEOHASH;
	const stadiumId = event.stadiumId ? event.stadiumId : umtEnvs.dft.MATCH.STADIUMID;
	const courtId = event.courtId ? String(event.courtId) : umtEnvs.dft.MATCH.COURTID;
	const genderFilter = event.genderFilter;
	let status = umtEnvs.dft.MATCH.STATUS;

	// Verificar si existe alguna solicitud desde el otro equipo
    dql.getMatch(dynamodb, process.env.DB_UMT_001, rangeKey, hashKey, function(err, data) {
        if (err) callback(err);
        else {
            // Existe una solicitud y no ha expirado
			if (Object.entries(data).length > 0 && data.constructor === Object && createdOn < data.Item.expireOn.S)
				callback(null, { teamId1: event.teamId2 });

            // Si no existe entonces agregar
            else 
                dql.addMatch(dynamodb, process.env.DB_UMT_001, hashKey, rangeKey, createdOn,
					expireOn, allowedPatches, positions, matchTypes, schedule, status, geohash,
					stadiumGeohash, stadiumId, courtId, genderFilter, callback);
        }
    });
};
