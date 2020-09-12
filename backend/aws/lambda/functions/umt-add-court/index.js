/**
 * Agrega una cancha a un club
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
	const hashKey = `${umtEnvs.pfx.STAD}${event.stadiumId}`;
	const matchTypes = event.matchTypes;
	const material = event.material ? event.material : '';

	// Obtener el id de la ultima cancha agregada para generar id actual
    dql.getLastCourtId(dynamodb, process.env.DB_UMT_001, hashKey, umtEnvs.pfx.COURT, function(err, lastId) {
        if (err) callback(err);
        else {
			const rangeKey = `${umtEnvs.pfx.COURT}${event.stadiumGeohash}#${lastId + 1}`;

			dql.addCourt(dynamodb, process.env.DB_UMT_001, hashKey, rangeKey, matchTypes,
				material, callback);
        }
    });
};
