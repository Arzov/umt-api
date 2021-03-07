/**
 * Queries sobre AWS DynamoDB
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


/**
 * Obtiene id de la ultima cancha agregada
 * @param {Object} db Conexion a DynamoDB
 * @param {String} tableName Nombre de la tabla
 * @param {String} hashKey Id del club
 * @param {String} prefix Prefijo a filtrar
 * @param {Function} fn Funcion callback
 */
const getLastCourtId = (db, tableName, hashKey, prefix, fn) => {
    db.query({
        TableName: tableName,
        TableName: tableName,
        KeyConditionExpression: 'hashKey = :v1 and begins_with ( rangeKey, :v2 )',
        ExpressionAttributeValues: {
            ':v1': { S: hashKey },
            ':v2': { S: prefix }
        },
        ScanIndexForward : false,
        Limit: 1
    },
    function(err, data) {
        if (err) fn(err);
        else {
            if (data.Count) fn(null, Number(data.Items[0].rangeKey.S.split('#')[2]));
            else fn(null, 0);
        }
    });
}

/**
 * Agrega una cancha
 * @param {Object} db Conexion a DynamoDB
 * @param {String} tableName Nombre de la tabla
 * @param {String} hashKey Id del club
 * @param {String} rangeKey Hash de geolocalizacion del club y id de la cancha
 * @param {String[]} matchFilter Tipo de juego soportado
 * @param {String} material Material
 * @param {Function} fn Funcion callback
 */
const addCourt = (db, tableName, hashKey, rangeKey, matchFilter, material, fn) => {
    db.putItem({
        TableName: tableName,
        Item: {
            hashKey: { S: hashKey },
            rangeKey: { S: rangeKey },
            matchFilter: { SS: matchFilter },
            material: { S: material }
        }
    }, function(err, data) {
        if (err) fn(err);
        else
            fn(null, {
                stadiumId: hashKey.split('#')[1],
                stadiumGeohash: rangeKey.split('#')[1],
                id: rangeKey.split('#')[2],
                matchFilter,
                material
            });
    });
}

module.exports.getLastCourtId = getLastCourtId;
module.exports.addCourt = addCourt;
