/**
 * Queries sobre AWS DynamoDB
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


/**
 * Agrega un usuario
 * @param {Object} db Conexion a DynamoDB
 * @param {String} tableName Nombre de la tabla
 * @param {String} hashKey Id
 * @param {String} rangeKey Id
 * @param {String} name Nombre
 * @param {String} picture URL de la imagen
 * @param {Object} formation Formación para cada tipo de juego
 * @param {Boolean} searchingPlayers Indicador de busqueda de integrantes
 * @param {String} geohash Hash de geolocalizacion
 * @param {Function} fn Funcion callback
 */
const addTeam = (db, tableName, hashKey, rangeKey, geohash, name, picture, formation,
    searchingPlayers, fn) => {
    db.putItem({
        TableName: tableName,
        Item: {
            'hashKey': { S: hashKey },
            'rangeKey': { S: rangeKey },
            'geohash': { S: geohash },
            'name': { S: name },
            'picture': { S: picture },
            'formation': { M: formation },
            'searchingPlayers': { B: searchingPlayers }
        }
    }, function(err, data) {
        if (err) fn(err);
        else
            fn(null, {
                id: hashKey.split('#')[1],
                geohash,
                name,
                picture,
                formation,
                searchingPlayers
            });
    });
}

module.exports.addTeam = addTeam;
