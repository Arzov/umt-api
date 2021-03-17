/**
 * Add a patch into the match
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */

const aws = require('aws-sdk');
const umtEnvs = require('umt-envs');
const dql = require('utils/dql');
let options = umtEnvs.gbl.DYNAMODB_CONFIG;

if (process.env.RUN_MODE === 'LOCAL') options = umtEnvs.dev.DYNAMODB_CONFIG;

const dynamodb = new aws.DynamoDB(options);

exports.handler = function (event, context, callback) {
    const hashKey = `${umtEnvs.pfx.MATCH}${event.teamId1}#${event.teamId2}`;
    const rangeKey = `${umtEnvs.pfx.PATCH}${event.userEmail}`;
    const joinedOn = new Date().toISOString();
    const reqStat = JSON.parse(event.reqStat);

    // Validate if the patch player is already in the match
    if (reqStat.PR.S === 'P') {
        dql.getMatchPatch(
            dynamodb,
            process.env.DB_UMT_001,
            hashKey,
            rangeKey,
            function (err, data) {
                if (err) callback(err);
                else {
                    if (
                        Object.entries(data).length > 0 &&
                        data.constructor === Object
                    )
                        callback(null, {
                            teamId1: data.Item.hashKey.S.split('#')[1],
                            teamId2: data.Item.hashKey.S.split('#')[2],
                            userEmail: data.Item.rangeKey.S.split('#')[1],
                            joinedOn: data.Item.joinedOn.S,
                            reqStat: JSON.stringify(data.Item.reqStat.M),
                        });
                    else
                        dql.addMatchPatch(
                            dynamodb,
                            process.env.DB_UMT_001,
                            hashKey,
                            rangeKey,
                            joinedOn,
                            reqStat,
                            callback
                        );
                }
            }
        );
    } else
        dql.addMatchPatch(
            dynamodb,
            process.env.DB_UMT_001,
            hashKey,
            rangeKey,
            joinedOn,
            reqStat,
            callback
        );
};
