/**
 * Agrega un mensaje al chat en AWS DynamoDB
 * @version 1.0.0
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


const aws = require('aws-sdk');
const moment = require('moment');
const dql = require('utils/dql');
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
	const hashKey = event.hashKey;
	const author = event.author;
	const authorName = event.authorName;
	const content = event.content;
	const rangeKey = moment().format() + '#' + author;

	// Agregar mensaje
	dql.addMessage(dynamodb, process.env.DB_UMT_MESSAGES, hashKey, rangeKey, author, authorName,
		content, function(err, data) {
		if (err) callback(err);
		else {
			callback(null, {
				hashKey,
				rangeKey,
				author,
				authorName,
				content
			});
		}
	});
};
