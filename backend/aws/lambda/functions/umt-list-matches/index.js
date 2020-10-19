/**
 * Obtiene partidos activos del equipo/jugador
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


const aws = require('aws-sdk');
const umtEnvs = require('umt-envs');
const dql = require('utils/dql');
let options = umtEnvs.gbl.DYNAMODB_CONFIG;
let limitScan = umtEnvs.gbl.MATCHES_SCAN_LIMIT;

if (process.env.RUN_MODE === 'LOCAL') {
    options = umtEnvs.dev.DYNAMODB_CONFIG;
    limitScan = umtEnvs.dev.MATCHES_SCAN_LIMIT;
}

const dynamodb = new aws.DynamoDB(options);


exports.handler = (event, context, callback) => {
    const hashKey = `${umtEnvs.pfx.MATCH}${event.id}`;
    const rangeKey = `${umtEnvs.pfx.PATCH}${event.email}`;
    const ownerNextToken = event.nextToken ? event.nextToken.split('&')[0] : null;
    const guestNextToken = event.nextToken ? event.nextToken.split('&')[1] : null;
    const patchNextToken = event.nextToken;

    if (event.id ) {
        dql.listOwnerMatches(dynamodb, process.env.DB_UMT_001, hashKey, limitScan,
            ownerNextToken, function(err, data) {
            if (err) callback(err);
            else {
                let ownerNextTokenResult = null;
                let guestNextTokenResult = null;
                let ownerDataResult = [];
                let guestDataResult = [];

                if ('LastEvaluatedKey' in data)
                    ownerNextTokenResult = JSON.stringify(data.LastEvaluatedKey);

                if (data.Count) {
                    ownerDataResult = data.Items.map(function(x) {
                        return {
                            teamId1: x.hashKey.S.split('#')[1],
                            teamId2: x.rangeKey.S.split('#')[1]
                        };
                    });
                }

                dql.listGuestMatches(dynamodb, process.env.DB_UMT_001, hashKey, limitScan,
                    guestNextToken, function(err, data) {
                    if (err) callback(err);
                    else {
                        if ('LastEvaluatedKey' in data)
                            guestNextTokenResult = JSON.stringify(data.LastEvaluatedKey);

                        if (data.Count) {
                            guestDataResult = data.Items.map(function(x) {
                                return {
                                    teamId1: x.hashKey.S.split('#')[1],
                                    teamId2: x.rangeKey.S.split('#')[1]
                                };
                            });
                        }

                        ownerNextTokenResult = ownerNextTokenResult ? ownerNextTokenResult : '';
                        guestNextTokenResult = guestNextTokenResult ? guestNextTokenResult : '';

                        callback(null, {
                            items: ownerDataResult.concat(guestDataResult),
                            nextToken: `${ownerNextTokenResult}&${guestNextTokenResult}`
                        });
                    }
                });
            }
        });
    } else
        dql.listPatchMatches(dynamodb, process.env.DB_UMT_001, rangeKey, limitScan,
            patchNextToken, function(err, data) {
            if (err) callback(err);
            else {
                let patchNextTokenResult = null;
                let patchDataResult = [];

                if ('LastEvaluatedKey' in data)
                    patchNextTokenResult = JSON.stringify(data.LastEvaluatedKey);

                if (data.Count) {
                    patchDataResult = data.Items.map(function(x) {
                        return {
                            teamId1: x.hashKey.S.split('#')[1],
                            teamId2: x.hashKey.S.split('#')[2]
                        };
                    });
                }

                callback(null, {
                    items: patchDataResult,
                    nextToken: patchNextTokenResult
                });
            }
        });
};
