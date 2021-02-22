/**
 * Queries sobre AWS DynamoDB
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


/**
 * Obtiene informacion del partido
 * @param {Object} db Conexion a DynamoDB
 * @param {String} tableName Nombre de la tabla
 * @param {String} hashKey Id del equipo organizador
 * @param {String} rangeKey Id del equipo invitado
 * @param {Function} fn Funcion callback
 */
const getTeam = (db, tableName, hashKey, rangeKey, fn) => {
    db.getItem({
        TableName: tableName,
        Key: {
            hashKey: { S: hashKey },
            rangeKey: { S: rangeKey }
        }
    }, function(err, data) {
        if (err) return fn(err);
        else
            if (Object.keys(data).length === 0 && data.constructor === Object) {
                fn(null, {});
            } else {
                fn(null, {
                    teamId1: data.Item.hashKey.S.split('#')[1],
                    teamId2: data.Item.rangeKey.S.split('#')[1],
                    allowedPatches: data.Item.allowedPatches.N,
                    positions: data.Item.positions.SS,
                    matchFilter: data.Item.matchFilter.SS,
                    schedule: JSON.stringify(data.Item.schedule.M),
                    reqStat: JSON.stringify(data.Item.reqStat.M),
                    stadiumGeohash: data.Item.stadiumGeohash.S,
                    stadiumId: data.Item.stadiumId.S,
                    courtId: data.Item.courtId.N,
                    genderFilter: data.Item.genderFilter.SS,
                    ageMinFilter: data.Item.ageMinFilter.N,
                    ageMaxFilter: data.Item.ageMaxFilter.N,
                    geohash: data.Item.geohash.S,
                    expireOn: data.Item.expireOn.S,
                    createdOn: data.Item.createdOn.S
                });
            }
    });
}

module.exports.getTeam = getTeam
