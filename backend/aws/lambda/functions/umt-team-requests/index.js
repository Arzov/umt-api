/**
 * Obtiene solicitudes de jugadores del equipo
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


const aws = require('aws-sdk');
const umtEnvs = require('umt-envs');
const dql = require('utils/dql');
let options = umtEnvs.gbl.DYNAMODB_CONFIG;

if (process.env.RUN_MODE === 'LOCAL') options = umtEnvs.dev.DYNAMODB_CONFIG;

const dynamodb = new aws.DynamoDB(options);
const limitScan = umtEnvs.gbl.REQUESTS_SCAN_LIMIT;


exports.handler = (event, context, callback) => {
    const hashKey = `${umtEnvs.pfx.TEAM}${event.id}`;
    const nextToken = event.nextToken;

    dql.teamRequests(dynamodb, process.env.DB_UMT_001, hashKey, limitScan, nextToken, function(err, data) {
        if (err) callback(err);
        else {
            let nextTokenResult = null;
            let dataResult = [];

            if ('LastEvaluatedKey' in data)
                nextTokenResult = JSON.stringify(data.LastEvaluatedKey);

            if (data.Count) {
                dataResult = data.Items.map(function(x) {
                    return {
                        teamId: x.hashKey.S.split('#')[1],
                        userEmail: x.rangeKey.S.split('#')[1],
                        reqStat: x.reqStat.M
                    };
                });
            }

            callback(null, {
                items: dataResult,
                nextToken: nextTokenResult
            });
        }
    });
};
