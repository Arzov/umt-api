/**
 * Obtiene equipos cercanos
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


const aws = require('aws-sdk');
const umtEnvs = require('umt-envs');
const dql = require('utils/dql');
let limitScan = umtEnvs.gbl.TEAMS_SCAN_LIMIT;
let options = umtEnvs.gbl.DYNAMODB_CONFIG;

if (process.env.RUN_MODE === 'LOCAL') {
    options = umtEnvs.dev.DYNAMODB_CONFIG;
    limitScan = umtEnvs.dev.TEAMS_SCAN_LIMIT;
}

const dynamodb = new aws.DynamoDB(options);


exports.handler = (event, context, callback) => {
    // TODO: Agregar id del equipo para filtrar en el resultado final
    const geohash = event.geohash;
    const forJoin = event.forJoin;
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

    dql.nearTeams(dynamodb, process.env.DB_UMT_001, geohash, forJoin, limitScan, nextToken, function(err, data) {
        if (err) callback(err);
        else {
            let nextTokenResult = null;
            let dataResult = [];

            if ('LastEvaluatedKey' in data)
                nextTokenResult = JSON.stringify(data.LastEvaluatedKey);

            if (data.Count) {
                dataResult = data.Items.map(function(x) {
                    return {
                        id: x.hashKey.S.split('#')[1],
                        name: x.name.S,
                        picture: x.picture.S,
                        formation: JSON.stringify(x.formation.M),
                        geohash: x.geohash.S,
                        searchingPlayers: x.searchingPlayers.BOOL
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
