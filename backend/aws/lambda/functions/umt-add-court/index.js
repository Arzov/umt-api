/**
 * Agrega una cancha en AWS DynamoDB
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
	const matchType = event.matchType;
	const name = event.name;
	const website = event.website;
	const email = event.email;
	const phone = event.phone;
	const information = event.information;
	const benefits = event.benefits;
	const schedule = event.schedule;
	const payCondition = event.payCondition;
	const prices = event.prices;
	const partner = event.partner;
	const active = event.active;
	const geoJson = "{\"type\":\"POINT\",\"coordinates\":[\""+ longitude +"\",\""+ latitude +"\"]}";
	let hashKey = ngeohash.encode(latitude, longitude, geohashLength);

	// Revisar si exite una ubicacion para la cancha
	dql.getCourt(dynamodb, process.env.DB_UMT_COURTS, rangeKey, function(err, data) {
		if (err) callback(err);
		else {
			// La ubicacion existente se elimina y se reemplaza por la nueva
			if (data.Count) {
				hashKey = data.Items[0].hashKey.N;

				dql.deleteLocation(dynamodb, process.env.DB_UMT_COURTS, hashKey, rangeKey,
					function(err, data) {
					if (err) callback(err);
					else {
						dql.addCourt(dynamodb, process.env.DB_UMT_COURTS, hashKey, rangeKey, geoJson,
							matchType, name, website, email, phone, information, benefits, schedule,
							payCondition, prices, partner, active, callback
						);
					}
				});
			}
			// Si no existe se crea la nueva ubicacion
			else {
				dql.addCourt(dynamodb, process.env.DB_UMT_COURTS, hashKey, rangeKey, geoJson, matchType,
					name, website, email, phone, information, benefits, schedule, payCondition, prices,
					partner, active, callback
				);
			}
		}
	});
};
