/**
 * Obtiene las canchas cercanas al usuario desde AWS DynamoDB
 * @version 1.0.0
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


const aws = require('aws-sdk');
const dql = require('utils/dql');
let options = { apiVersion: '2012-08-10' }

if (process.env.RUN_MODE === 'LOCAL') {
	options.endpoint = 'http://arzov:8000'
	options.accessKeyId = 'xxxx'
	options.secretAccessKey = 'xxxx'
	options.region = 'localhost'
}

const dynamodb = new aws.DynamoDB(options);
const limitScan = 100;


exports.handler = (event, context, callback) => {
    const hashKey = String(event.hashKey);
    const matchType = event.matchType;
    let nextToken = event.nextToken;

    /**
     * El hashKey del nextToken debe ser igual al hashKey del usuario,
     * en caso que no sea se anula el nextToken, de esta manera se evita
     * que AWS DynamoDB no pueda encontrar la particion correcta.
     * Esto puede ocurrir debido a que el usuario se traslade a otro sitio
     * y cambie su hashKey respecto a la última búsqueda de canchas.
     */
    if (nextToken) {
        if (Number(JSON.parse(nextToken).hashKey.S) !== String(hashKey)) {
            nextToken = null;
        }
    }

    // Obtener canchas cercanas
    dql.getCourts(dynamodb, process.env.DB_UMT_COURTS, hashKey, matchType, limitScan,
        nextToken, function(err, data) {
        if (err) callback(err);
        else {
            // Obtener nextToken para paginacion
            let nextTokenResult = null;

            if ('LastEvaluatedKey' in data) {
                nextTokenResult = JSON.stringify(data.LastEvaluatedKey);
            }

            // Existen canchas
            if (data.Count) {
                // Quitar tipo de datos al resultado de DynamoDB
                const dataResult = data.Items.map(function(x) {
                    let unmarshallResult = aws.DynamoDB.Converter.unmarshall(x);

                    unmarshallResult.geoJson = JSON.parse(unmarshallResult.geoJson).coordinates;
                    unmarshallResult.email = unmarshallResult.email.values;
                    unmarshallResult.matchType = unmarshallResult.matchType.values;
                    unmarshallResult.phone = unmarshallResult.phone.values;

                    // No se necesita geohash
                    delete unmarshallResult['geohash'];

                    return unmarshallResult;
                });

                callback(null, {
                    items: dataResult,
                    nextToken: nextTokenResult
                });
            }

            // No existen canchas
            else {
                callback(null, {
                    items: [],
                    nextToken: nextTokenResult
                });
            }
        }
    });
};
