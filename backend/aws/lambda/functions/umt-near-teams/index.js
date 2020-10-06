/**
 * Obtiene equipos cercanos
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


const aws = require('aws-sdk');
const umtEnvs = require('umt-envs');
const dql = require('utils/dql');
let options = { apiVersion: '2012-08-10' };
let limitScan = umtEnvs.gbl.TEAMS_SCAN_LIMIT;

if (process.env.RUN_MODE === 'LOCAL') {
	options.endpoint = 'http://arzov:8000'
	options.accessKeyId = 'xxxx'
	options.secretAccessKey = 'xxxx'
    options.region = 'localhost'
    limitScan = 1
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

    dql.nearTeams(dynamodb, process.env.DB_UMT_001, geohash, limitScan, nextToken, function(err, data) {
        if (err) callback(err);
        else {
            let nextTokenResult = null;

            if ('LastEvaluatedKey' in data)
                nextTokenResult = JSON.stringify(data.LastEvaluatedKey);

            if (data.Count) {
                const dataResult = data.Items.map(function(x) {
                    let umResult = aws.DynamoDB.Converter.unmarshall(x);

                    umResult.id = umResult.hashKey.split('#')[1];

                    delete umResult['rangeKey'];
                    delete umResult['hashKey'];

                    return umResult;
                });

                callback(null, {
                    items: dataResult,
                    nextToken: nextTokenResult
                });
            }

            else callback(null, { items: [], nextToken: nextTokenResult });
        }
    });
};
