/**
 * Queries sobre AWS DynamoDB
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


/**
 * Agrega un club deportivo
 * @param {Object} db Conexion a DynamoDB
 * @param {String} tableName Nombre de la tabla
 * @param {String} hashKey Id
 * @param {String} rangeKey Hash de geolocalizacion
 * @param {String} name Nombre
 * @param {String[]} matchTypes Tipo de juegos soportados
 * @param {Object} coords Coordenadas de la ubicacion
 * @param {String} address Direccion
 * @param {Function} fn Funcion callback
 */
const addStadium = (db, tableName, hashKey, rangeKey, name, matchTypes, coords, address, fn) => {
    db.putItem({
        TableName: tableName,
        Item: {
            'hashKey': { S: hashKey },
            'rangeKey': { S: rangeKey },
            'name': { S: name },
            'matchTypes': { SS: matchTypes },
            'coords': { M: coords },
            'address': { S: address }
        }
    }, function(err, data) {
        if (err) fn(err);
        else
            fn(null, {
                id: hashKey.split('#')[1],
                geohash: rangeKey.split('#')[1],
                name,
                matchTypes,
                coords: JSON.stringify(coords),
                address
            });
    });
}

module.exports.addStadium = addStadium;
