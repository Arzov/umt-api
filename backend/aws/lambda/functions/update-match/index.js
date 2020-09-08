/**
 * Acutaliza estado de un match en AWS DynamoDB
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


exports.handler = (event, context, callback) => {
    const hashKey = event.hashKey;
    const rangeKey = event.rangeKey;
    const matchId = event.matchId;
    const userStatus = event.userStatus;
    const creatorId = matchId.split('#')[0];

    // Obtener informacion del match
    dql.getMatch(dynamodb, process.env.DB_UMT_MATCHES, hashKey, rangeKey, function(err, data) {
        if (err) callback(err);
        else {
            // El usuario solicitante es el creador del match
            if (hashKey === creatorId) {
                const isCreator = true;

                // El usuario rival cancelo el match
                if (data.Item.matchStatus.S === 'D') {
                    // El creador solo puede cancelar el match
                    const creatorStatus = 'C';
                    const adversaryStatus = 'C';

                    dql.updateMatch(dynamodb, process.env.DB_UMT_MATCHES, hashKey, rangeKey, creatorStatus,
                        adversaryStatus, isCreator, callback);
                }

                // El match sigue pendiente
                else {
                    // El creador solo puede cancelar el match
                    const creatorStatus = 'C';
                    const adversaryStatus = 'D';

                    dql.updateMatch(dynamodb, process.env.DB_UMT_MATCHES, hashKey, rangeKey, creatorStatus,
                        adversaryStatus, isCreator, callback);
                }
            }

            // El usuario solicitante es el invitado del match
            else {
                const isCreator = false;

                switch (userStatus) {

                    // El usuario acepta la solicitud
                    case 'A':
                        // El usuario creador cancelo el match
                        if (data.Item.matchStatus.S === 'D') {
                            // No actualizar nada y devolver el estado rechazado
                            callback(null, { matchStatus: 'D' });
                        }

                        // El match sigue pendiente
                        else {
                            // Match aceptado por ambas partes
                            const creatorStatus = 'A';
                            const adversaryStatus = 'A';

                            dql.updateMatch(dynamodb, process.env.DB_UMT_MATCHES, rangeKey, hashKey,
                                creatorStatus, adversaryStatus, isCreator, callback);
                        }
                        break;

                    // El usuario rechaza la solicitud
                    case 'D':
                        // El usuario creador cancelo el match
                        if (data.Item.matchStatus.S === 'D') {
                            // Se debe cancelar el match en su totalidad
                            const creatorStatus = 'C';
                            const adversaryStatus = 'C';

                            dql.updateMatch(dynamodb, process.env.DB_UMT_MATCHES, rangeKey, hashKey,
                                creatorStatus, adversaryStatus, isCreator, callback);
                        }

                        // El match sigue pendiente
                        else {
                            /**
                             * Se notifica al creador que el match es rechazado y se cancela
                             * por parte del adversario
                             */
                            const creatorStatus = 'D';
                            const adversaryStatus = 'C';

                            dql.updateMatch(dynamodb, process.env.DB_UMT_MATCHES, rangeKey, hashKey,
                                creatorStatus, adversaryStatus, isCreator, callback);
                        }
                        break;

                    /**
                     * El usuario cancelo la solicitud (solo puede dar esta opcion cuando el
                     * creador cancelo el match)
                     */ 
                    case 'C':
                        // Se debe cancelar el match en su totalidad
                        const creatorStatus = 'C';
                        const adversaryStatus = 'C';

                        dql.updateMatch(dynamodb, process.env.DB_UMT_MATCHES, rangeKey, hashKey,
                            creatorStatus, adversaryStatus, isCreator, callback);
                        break;
                }
            }
        }
    });
};
