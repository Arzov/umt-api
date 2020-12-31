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
    const hashKey = event.id ? `${umtEnvs.pfx.MATCH}${event.id}` : '';
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

    // TODO: Completar filtros de edad y sexo
    dql.nearMatches(dynamodb, process.env.DB_UMT_001, geohash, hashKey, limitScan, nextToken, function(err, data) {
        if (err) callback(err);
        else {
            let nextTokenResult = null;
            let dataResult = [];

            if ('LastEvaluatedKey' in data)
                nextTokenResult = JSON.stringify(data.LastEvaluatedKey);

            if (data.Count) {
                dataResult = data.Items.map(function(x) {
                    if (hashKey !== x.rangeKey.S)
                        return {
                            teamId1: x.hashKey.S.split('#')[1],
                            teamId2: x.rangeKey.S.split('#')[1],
                            createdOn: x.createdOn.S,
                            allowedPatches: x.allowedPatches.N,
                            positions: x.positions.SS,
                            matchTypes: x.matchTypes.SS,
                            expireOn: x.expireOn.S,
                            schedule: JSON.stringify(x.schedule.M),
                            reqStat: JSON.stringify(x.reqStat.M),
                            geohash: x.geohash.S,
                            stadiumGeohash: x.stadiumGeohash.S,
                            stadiumId: x.stadiumId.S,
                            courtId: x.courtId.N,
                            genderFilter: x.genderFilter.SS
                        };
                }).filter(function (el) {return el != null});
            }

            callback(null, {
                items: dataResult,
                nextToken: nextTokenResult
            });
        }
    });
};
