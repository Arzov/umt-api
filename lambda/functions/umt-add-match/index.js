/**
 * Crea un match entre equipos
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


const aws = require('aws-sdk');
const umtEnvs = require('umt-envs');
const moment = require('moment');
const dql = require('utils/dql');
let optionsDynamodb = umtEnvs.gbl.DYNAMODB_CONFIG;
let optionsLambda = umtEnvs.gbl.LAMBDA_CONFIG;

if (process.env.RUN_MODE === 'LOCAL') {
	optionsDynamodb = umtEnvs.dev.DYNAMODB_CONFIG;
	optionsLambda = umtEnvs.dev.LAMBDA_CONTAINER_CONFIG;
}

const dynamodb = new aws.DynamoDB(optionsDynamodb);
const lambda = new aws.Lambda(optionsLambda)
const daysToExpire = umtEnvs.gbl.DAYS_TO_EXPIRE;


exports.handler = function(event, context, callback) {
	const hashKey = `${umtEnvs.pfx.MATCH}${event.teamId1}`;
	const rangeKey = `${umtEnvs.pfx.MATCH}${event.teamId2}`;
	const createdOn = moment().format();
	const expireOn = moment().add(daysToExpire, 'days').format();
	const allowedPatches = event.allowedPatches ? String(event.allowedPatches) : umtEnvs.dft.MATCH.ALLOWED_PATCHES;
	const positions = event.positions ? event.positions : umtEnvs.dft.MATCH.POSITIONS;
	const ageMinFilter = String(event.ageMinFilter);
	const ageMaxFilter = String(event.ageMaxFilter);
	const matchFilter = event.matchFilter;
	// TODO: Revisar tiempo local vs tiempo del servidor (por lado del cliente en frontend)
	const schedule = event.schedule ? JSON.parse(event.schedule) :
		{day: {S: expireOn.split('T')[0]}, time: {S: expireOn.split('T')[1].substr(0, 5)}};
	const geohash = event.geohash;
	const stadiumGeohash = event.stadiumGeohash ? event.stadiumGeohash : umtEnvs.dft.MATCH.STADIUMGEOHASH;
	const stadiumId = event.stadiumId ? event.stadiumId : umtEnvs.dft.MATCH.STADIUMID;
	const courtId = event.courtId ? String(event.courtId) : umtEnvs.dft.MATCH.COURTID;
	const genderFilter = event.genderFilter;
	const reqStat = umtEnvs.dft.MATCH.REQSTAT;
	const latitude = event.latitude;
	const longitude = event.longitude;
	const coords = {LON: {N: String(longitude)}, LAT: {N: String(latitude)}};

	// Verificar si existe alguna solicitud desde el otro equipo
    let params = { FunctionName: 'umt-get-match' };
	params.Payload = JSON.stringify({
		teamId1: event.teamId2,
		teamId2: event.teamId1
	});
	lambda.invoke(params, function(err, data) {
        if (err) callback(err);
        else {
			const response = JSON.parse(data.Payload)

            // Existe una solicitud y no ha expirado
			if (Object.entries(response).length > 0 && response.constructor === Object && createdOn < response.expireOn) {
				let err = new Error(JSON.stringify({
					code: 'MatchExistsException',
					message: `Ya existe una solicitud desde el equipo rival.`
				}));
				callback(err);
			}

            // Si no existe entonces agregar
            else 
                dql.addMatch(dynamodb, process.env.DB_UMT_001, hashKey, rangeKey, createdOn,
					expireOn, allowedPatches, positions, ageMinFilter, ageMaxFilter, matchFilter,
					schedule, reqStat, geohash, coords, stadiumGeohash, stadiumId, courtId,
					genderFilter, callback);
        }
    });
};
