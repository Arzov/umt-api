/**
 * Obtiene partidos cercanos
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


const aws = require('aws-sdk');
const umtEnvs = require('umt-envs');
const dql = require('utils/dql');
let limitScan = umtEnvs.gbl.MATCHES_SCAN_LIMIT;
let options = umtEnvs.gbl.DYNAMODB_CONFIG;

if (process.env.RUN_MODE === 'LOCAL') {
    options = umtEnvs.dev.DYNAMODB_CONFIG;
    limitScan = umtEnvs.dev.MATCHES_SCAN_LIMIT;
}

const dynamodb = new aws.DynamoDB(options);


exports.handler = (event, context, callback) => {
    const geohash = event.geohash;
    let nextToken = event.nextToken;

    /**
     * El geohash del nextToken debe ser igual al geohash del equipo/usuario,
     * en caso de que no lo sea se anula el nextToken, de esta manera se evita
     * que AWS DynamoDB no pueda encontrar la particion correcta.
     * Esto puede ocurrir debido a que el equipo/usuario se traslade a otro sitio
     * y cambie su geohash.
     */
    if (nextToken) {
        if (JSON.parse(nextToken).geohash.S !== geohash) nextToken = null;
    }

    dql.nearMatches(dynamodb, process.env.DB_UMT_001, geohash, limitScan, nextToken, function(err, data) {
        if (err) callback(err);
        else {
            let nextTokenResult = null;

            if ('LastEvaluatedKey' in data)
                nextTokenResult = JSON.stringify(data.LastEvaluatedKey);

            if (data.Count) {
                const dataResult = data.Items.map(function(x) {
                    return {
                        teamId1: x.hashKey.S.split('#')[1],
                        teamId2: x.rangeKey.S.split('#')[1],
                        createdOn: x.createdOn.S,
                        allowedPatches: x.allowedPatches.N,
                        positions: x.positions.SS,
                        matchTypes: x.matchTypes.SS,
                        expireOn: x.expireOn.S,
                        schedule: x.schedule.M,
                        reqStat: x.reqStat.M,
                        geohash: x.geohash.S,
                        stadiumGeohash: x.stadiumGeohash.S,
                        stadiumId: x.stadiumId.S,
                        courtId: x.courtId.N
                    };
                });

                callback(null, {
                    items: dataResult,
                    nextToken: nextTokenResult
                });
            }

            else callback(null, {items: [], nextToken: nextTokenResult});
        }
    });
};
