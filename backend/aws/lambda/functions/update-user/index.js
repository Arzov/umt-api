/**
 * Acutaliza información del usuario en AWS DynamoDB
 * @version 1.0.0
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


const aws = require('aws-sdk');
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
    const hashKey = event.hashKey;
    const rangeKey = event.rangeKey;
    const genderFilter = event.genderFilter;
    const ageMinFilter = String(event.ageMinFilter);
    const ageMaxFilter = String(event.ageMaxFilter);
    const matchFilter = event.matchFilter;

    dql.updateUser(dynamodb, process.env.DB_UMT_USERS, hashKey, rangeKey, genderFilter, ageMinFilter,
        ageMaxFilter, matchFilter, function(err, data) {
        if (err) callback(err);
        else callback(null, { hashKey });
    });
};
