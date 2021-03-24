/**
 * Get player's from/to team requests
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */

const aws = require('aws-sdk');
const umtEnvs = require('umt-envs');
const dql = require('utils/dql');
let options = umtEnvs.gbl.DYNAMODB_CONFIG;
let limitScan = umtEnvs.gbl.REQUESTS_SCAN_LIMIT;

if (process.env.RUN_MODE === 'LOCAL') {
    options = umtEnvs.dev.DYNAMODB_CONFIG;
    limitScan = umtEnvs.dev.REQUESTS_SCAN_LIMIT;
}

const dynamodb = new aws.DynamoDB(options);

exports.handler = (event, context, callback) => {
    const rangeKey = `${umtEnvs.pfx.MEM}${event.email}`;
    const nextToken = event.nextToken;

    dql.teamMemberRequests(
        dynamodb,
        process.env.DB_UMT_001,
        rangeKey,
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
                            teamId: x.hashKey.S.split('#')[1],
                            email: x.rangeKey.S.split('#')[1],
                            reqStat: JSON.stringify(x.reqStat.M),
                        };
                    });
                }

                callback(null, {
                    items: dataResult,
                    nextToken: nextTokenResult,
                });
            }
        }
    );
};
