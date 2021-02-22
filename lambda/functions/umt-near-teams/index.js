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
    let ownTeams = event.ownTeams ? event.ownTeams : ['']; // filtra equipos al que ya pertenece
    const geohash = event.geohash;
    const forJoin = event.forJoin; // true: busca equipo para unirse, false: busca equipo rival
    const gender = event.gender;
    const genderFilter = event.genderFilter;
    const ageMinFilter = String(event.ageMinFilter);
    const ageMaxFilter = String(event.ageMaxFilter);
    let matchFilter = event.matchFilter;
    let nextToken = event.nextToken;

    // Completar 'matchFilter' de largo 3 con ' '
    const l = 3 - matchFilter.length
    for (let i = 0; i < l; i++) { matchFilter.push(' ') }

    // Prefijo a los id
    ownTeams = ownTeams.map(function(x) {
        return `${umtEnvs.pfx.TEAM}${x}`
    })

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

    dql.nearTeams(dynamodb, process.env.DB_UMT_001, geohash, forJoin, limitScan,
        ownTeams, gender, genderFilter, ageMinFilter, ageMaxFilter, matchFilter, nextToken,
        function(err, data) {
        if (err) callback(err);
        else {
            let nextTokenResult = null;
            let dataResult = [];

            if ('LastEvaluatedKey' in data)
                nextTokenResult = JSON.stringify(data.LastEvaluatedKey);

            if (data.Count) {
                dataResult = data.Items.map(function(x) {
                    const id = x.hashKey.S.split('#')[1];

                    return {
                        id,
                        name: x.name.S,
                        picture: x.picture.S,
                        formation: JSON.stringify(x.formation.M),
                        geohash: x.geohash.S,
                        searchingPlayers: x.searchingPlayers.BOOL,
                        ageMinFilter: x.ageMinFilter.N,
                        ageMaxFilter: x.ageMaxFilter.N,
                        genderFilter: x.genderFilter.SS,
                        matchFilter: x.matchFilter.SS
                    };
                })
            }

            callback(null, {
                items: dataResult,
                nextToken: nextTokenResult
            });
        }
    });
};
