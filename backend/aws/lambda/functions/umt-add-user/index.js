/**
 * Agrega un usuario con su geolocalización en AWS DynamoDB
 * @version 1.0.0
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


const aws = require('aws-sdk');
const ngeohash = require('ngeohash');
const dql = require('utils/dql');
const geohashLength = 6;
let options = { apiVersion: '2012-08-10' }

if (process.env.RUN_MODE === 'LOCAL') {
	options.endpoint = 'http://arzov:8000'
	options.accessKeyId = 'xxxx'
	options.secretAccessKey = 'xxxx'
	options.region = 'localhost'
}

const dynamodb = new aws.DynamoDB(options);


exports.handler = function(event, context, callback) {
	// Parametros del usuario
	const latitude = event.latitude;
	const longitude = event.longitude;
	const rangeKey = event.rangeKey;
	const genderFilter = event.genderFilter;
	const ageMinFilter = String(event.ageMinFilter);
	const ageMaxFilter = String(event.ageMaxFilter);
	const matchFilter = event.matchFilter;
	const geoJson = "{\"type\":\"POINT\",\"coordinates\":[\""+ longitude +"\",\""+ latitude +"\"]}";
	let hashKey = ngeohash.encode(latitude, longitude, geohashLength);

	// Revisar si exite una ubicacion para el usuario
	dql.getUser(dynamodb, process.env.DB_UMT_USERS, rangeKey, function(err, data) {
		if (err) callback(err);
		else {
			// La ubicacion existente se elimina y se reemplaza por la nueva
			if (data.Count) {
				const hashKey = data.Items[0].hashKey.S;

				dql.deleteLocation(dynamodb, process.env.DB_UMT_USERS, hashKey, rangeKey,
					function(err, data) {
					if (err) callback(err);
					else {
						dql.addUser(dynamodb, process.env.DB_UMT_USERS, hashKey, rangeKey, geoJson,
							genderFilter, ageMinFilter, ageMaxFilter, matchFilter, callback);
					}
				});
			}
			// Si no existe se crea la nueva ubicacion
			else {
				dql.addUser(dynamodb, process.env.DB_UMT_USERS, hashKey, rangeKey, geoJson,
					genderFilter, ageMinFilter, ageMaxFilter, matchFilter, callback);
			}
		}
	});
};
