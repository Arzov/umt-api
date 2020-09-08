/**
 * Obtiene matches activos o pendientes del usuario desde AWS DynamoDB
 * @version 1.0.0
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


const aws = require('aws-sdk');
const dql = require('utils/dql');
const moment = require('moment');
let options = { apiVersion: '2012-08-10' }

if (process.env.RUN_MODE === 'LOCAL') {
	options.endpoint = 'http://arzov:8000'
	options.accessKeyId = 'xxxx'
	options.secretAccessKey = 'xxxx'
	options.region = 'localhost'
}

const dynamodb = new aws.DynamoDB(options);
const limitScan = 100;


exports.handler = (event, context, callback) => {
    const hashKey = event.hashKey;
    const nextToken = event.nextToken;
    let currentDate = moment().format();

    // Obtener matches
    dql.getMatches(dynamodb, process.env.DB_UMT_MATCHES, hashKey, currentDate, limitScan, nextToken,
        function(err, data) {
        if (err) callback(err);
        else {
            // Obtener nextToken para paginacion
            let nextTokenResult = null;

            if ('LastEvaluatedKey' in data) {
                nextTokenResult = JSON.stringify(data.LastEvaluatedKey);
            }

            // Existen rivales
            if (data.Count) {
                // Quitar tipo de datos al resultado de DynamoDB
                const dataResult = data.Items.map(function(x) {
                    return aws.DynamoDB.Converter.unmarshall(x);
                });

                callback(null, {
                    items: dataResult,
                    nextToken: nextTokenResult
                });
            }

            // No existen rivales
            else {
                callback(null, {
                    items: [],
                    nextToken: nextTokenResult
                });
            }
        }
    });
};
