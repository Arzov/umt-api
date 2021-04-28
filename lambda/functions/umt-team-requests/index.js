/**
 * Get team requests from/to players
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


// packages

const umtEnvs = require('umt-envs');
const aws = require('aws-sdk');
const dql = require('utils/dql');


// configurations

let options = umtEnvs.gbl.DYNAMODB_CONFIG;
let limitScan = umtEnvs.gbl.SCAN_LIMIT;

if (process.env.RUN_MODE === 'LOCAL') {
    options = umtEnvs.dev.DYNAMODB_CONFIG;
    limitScan = umtEnvs.dev.SCAN_LIMIT;
}

const dynamodb = new aws.DynamoDB(options);


// execution

exports.handler = (event, context, callback) => {

    const hashKey = `${umtEnvs.pfx.TEAM}${event.id}`;
    const nextToken = event.nextToken;

    dql.teamRequests(
        dynamodb,
        process.env.DB_UMT_001,
        hashKey,
        limitScan,
        nextToken,

        function (err, data) {

            if (err) callback(err);

            else {

                let nextTokenResult = null;
                let dataResult = [];

                if ('LastEvaluatedKey' in data)
                    nextTokenResult = JSON.stringify(data.LastEvaluatedKey);

                if (data.Count) {
                    dataResult = data.Items.map(function (x) {
                        return {
                            teamId  : x.hashKey.S.split('#')[1],
                            email   : x.rangeKey.S.split('#')[1],
                            reqStat : JSON.stringify(x.reqStat.M),
                            name    : x.name.S
                        };
                    });
                }

                callback(null, {
                    items       : dataResult,
                    nextToken   : nextTokenResult,
                });
            }
        }
    );
};
