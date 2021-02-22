/**
 * Queries sobre AWS DynamoDB
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


/**
 * Obtiene informacion del equipo
 * @param {Object} db Conexion a DynamoDB
 * @param {String} tableName Nombre de la tabla
 * @param {String} hashKey Id del equipo
 * @param {String} rangeKey Id del equipo
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
                    id: data.Item.hashKey.S.split('#')[1],
                    name: data.Item.name.S,
                    picture: data.Item.picture.S,
                    ageMinFilter: data.Item.ageMinFilter.N,
                    ageMaxFilter: data.Item.ageMaxFilter.N,
                    genderFilter: data.Item.genderFilter.SS,
                    matchFilter: data.Item.matchFilter.SS,
                    formation: JSON.stringify(data.Item.formation.M),
                    geohash: data.Item.geohash.S,
                    searchingPlayers: data.Item.searchingPlayers.BOOL
                });
            }
    });
}

module.exports.getTeam = getTeam
