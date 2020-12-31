/**
 * Queries sobre AWS DynamoDB
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


/**
 * Obtiene informacion del usuario
 * @param {Object} db Conexion a DynamoDB
 * @param {String} tableName Nombre de la tabla
 * @param {String} hashKey Email
 * @param {String} rangeKey Email
 * @param {Function} fn Funcion callback
 */
const getUser = (db, tableName, hashKey, rangeKey, fn) => {
    db.getItem({
        TableName: tableName,
        Key: {
            'hashKey': { S: hashKey },
            'rangeKey': { S: rangeKey }
        }
    }, function(err, data) {
        if (err) return fn(err);
        else
            if (Object.keys(data).length === 0 && data.constructor === Object) {
                fn(null, {});
            } else {
                fn(null, {
                    email: data.Item.hashKey.S.split('#')[1],
                    geohash: data.Item.geohash.S,
                    coords: JSON.stringify(data.Item.coords.M),
                    genderFilter: data.Item.genderFilter.SS,
                    ageMinFilter: data.Item.ageMinFilter.N,
                    ageMaxFilter: data.Item.ageMaxFilter.N,
                    matchFilter: data.Item.matchFilter.SS,
                    positions: data.Item.positions.SS,
                    skills: JSON.stringify(data.Item.skills.M),
                    foot: data.Item.foot.S,
                    weight: data.Item.weight.N,
                    height: data.Item.height.N
                });
            }
    });
}

module.exports.getUser = getUser
