/**
 * Obtiene solicitudes de partidos para parchar
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
    const rangeKey = `${umtEnvs.pfx.PATCH}${event.email}`;
    const nextToken = event.nextToken;

    dql.matchPatchRequests(dynamodb, process.env.DB_UMT_001, rangeKey, limitScan, nextToken, function(err, data) {
        if (err) callback(err);
        else {
            let nextTokenResult = null;
            let dataResult = [];

            if ('LastEvaluatedKey' in data)
                nextTokenResult = JSON.stringify(data.LastEvaluatedKey);

            if (data.Count) {
                dataResult = data.Items.map(function(x) {
                    return {
                        teamId1: x.hashKey.S.split('#')[1],
                        teamId2: x.hashKey.S.split('#')[2],
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
