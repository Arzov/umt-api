/**
 * Agrega un match en AWS DynamoDB
 * @version 1.0.0
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


const aws = require('aws-sdk');
const moment = require('moment');
const dql = require('utils/dql');
let options = { apiVersion: '2012-08-10' }

if (process.env.RUN_MODE === 'LOCAL') {
	options.endpoint = 'http://arzov:8000'
	options.accessKeyId = 'xxxx'
	options.secretAccessKey = 'xxxx'
	options.region = 'localhost'
}

const dynamodb = new aws.DynamoDB(options);
const daysToExpire = 10;


exports.handler = (event, context, callback) => {
    // Parametros del usuario
    const hashKey = event.hashKey;
    const rangeKey = event.rangeKey;
    const geohash = String(event.geohash);
    const creatorName = event.creatorName;
    const creatorPicture = event.creatorPicture;
    const adversaryName = event.adversaryName;
    const adversaryPicture = event.adversaryPicture;
    const matchFilter = event.matchFilter;
    const genderFilter = event.genderFilter;
    const ageMinFilter = String(event.ageMinFilter);
    const ageMaxFilter = String(event.ageMaxFilter);
    const createdAt = moment().format();
    const expireAt = moment().add(daysToExpire, 'days').format();

    // Verificar si el match ya existe
    dql.getMatch(dynamodb, process.env.DB_UMT_MATCHES, hashKey, rangeKey, function(err, data) {
        if (err) callback(err);
        else {
            // Existe el match
            if (Object.entries(data).length > 0 && data.constructor === Object) {
                const creatorId = data.Item.matchId.S.split('#')[0];

                // El usuario solicitante es el creador del match
                if (hashKey === creatorId) {
                    // Si el match expiro se vuelve a agregar el match
                    if (createdAt >= data.Item.expireAt.S) {
                        const matchStatus = 'P';
                        const matchId = hashKey + '#' + rangeKey;

                        dql.createMatch(dynamodb, process.env.DB_UMT_MATCHES, hashKey, rangeKey,
                            matchId, geohash, creatorName, creatorPicture, adversaryName,
                            adversaryPicture, createdAt, expireAt, matchStatus, matchFilter,
                            genderFilter, ageMinFilter, ageMaxFilter, callback);
                    }

                    // Si no expiro entonces no hacer nada y devolver el matchId
                    else callback(null, { matchId: data.Item.matchId.S });
                }

                // El usuario solicitante es el invitado del match
                else {
                    // Si el match expiro se vuelve a agregar el match
                    if (createdAt >= data.Item.expireAt.S) {
                        const matchStatus = 'P';
                        const matchId = hashKey + '#' + rangeKey;

                        dql.createMatch(dynamodb, process.env.DB_UMT_MATCHES, hashKey, rangeKey,
                            matchId, geohash, creatorName, creatorPicture, adversaryName,
                            adversaryPicture, createdAt, expireAt, matchStatus, matchFilter,
                            genderFilter, ageMinFilter, ageMaxFilter, callback);
                    }

                    // Si el estado es pendiente entonces se acepta la solicitud
                    else if (data.Item.matchStatus.S === 'P') {
                        const matchStatus = 'A';
                        const matchId = data.Item.matchId.S;
                        const geohash = data.Item.geohash.S;
                        const adversaryName = event.creatorName;
                        const adversaryPicture = event.creatorPicture;
                        const creatorName = data.Item.adversaryName.S;
                        const creatorPicture = data.Item.adversaryPicture.S;
                        const matchFilter = data.Item.matchFilter.S;
                        const genderFilter = data.Item.genderFilter.S;
                        const ageMinFilter = data.Item.ageMinFilter.N;
                        const ageMaxFilter = data.Item.ageMaxFilter.N;
                        const createdAt = data.Item.createdAt.S;
                        const expireAt = data.Item.expireAt.S;

                        dql.createMatch(dynamodb, process.env.DB_UMT_MATCHES, rangeKey, hashKey,
                            matchId, geohash, creatorName, creatorPicture, adversaryName,
                            adversaryPicture, createdAt, expireAt, matchStatus, matchFilter,
                            genderFilter, ageMinFilter, ageMaxFilter, callback);
                    }

                    // En caso contrario no hacer nada
                    else callback(null, { matchId: data.Item.matchId.S });
                }
            }

            // Si no existe entonces agregar match
            else {
                const matchStatus = 'P';
                const matchId = hashKey + '#' + rangeKey;

                dql.createMatch(dynamodb, process.env.DB_UMT_MATCHES, hashKey, rangeKey, matchId,
                    geohash, creatorName, creatorPicture, adversaryName, adversaryPicture, createdAt,
                    expireAt, matchStatus, matchFilter, genderFilter, ageMinFilter, ageMaxFilter,
                    callback);
            }
        }
    });
};
