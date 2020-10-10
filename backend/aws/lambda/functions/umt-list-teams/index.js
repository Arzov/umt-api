/**
 * Obtiene equipos al que pertenece el usuario
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


const aws = require('aws-sdk');
const umtEnvs = require('umt-envs');
const dql = require('utils/dql');
let options = { apiVersion: '2012-08-10' }

if (process.env.RUN_MODE === 'LOCAL') {
	options.endpoint = 'http://arzov:8000'
	options.accessKeyId = 'xxxx'
	options.secretAccessKey = 'xxxx'
    options.region = 'localhost'
}

const dynamodb = new aws.DynamoDB(options);
const limitScan = umtEnvs.gbl.TEAMS_SCAN_LIMIT;


exports.handler = (event, context, callback) => {
    const rangeKey = `${umtEnvs.pfx.MEM}${event.email}`;
    const nextToken = event.nextToken;

    dql.listTeams(dynamodb, process.env.DB_UMT_001, rangeKey, limitScan, nextToken, function(err, data) {
        if (err) callback(err);
        else {
            let nextTokenResult = null;

            if ('LastEvaluatedKey' in data)
                nextTokenResult = JSON.stringify(data.LastEvaluatedKey);

            if (data.Count) {
                const dataResult = data.Items.map(function(x) {
                    return {
                        id: x.hashKey.S.split('#')[1]
                    };
                });

                callback(null, {
                    items: dataResult,
                    nextToken: nextTokenResult
                });
            }

            else callback(null, { items: [], nextToken: nextTokenResult });
        }
    });
};
