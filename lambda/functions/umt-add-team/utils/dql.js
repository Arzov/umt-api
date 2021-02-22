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
 * @param {String} ageMinFilter Edad minima de los jugadores
 * @param {String} ageMaxFilter Edad maxima de los jugadores
 * @param {String[]} matchFilter Tipos de juego que participa
 * @param {String[]} genderFilter Sexo de los jugadores
 * @param {Object} formation Formación para cada tipo de juego
 * @param {Boolean} searchingPlayers Indicador de busqueda de nuevos integrantes
 * @param {String} geohash Hash de geolocalizacion
 * @param {Function} fn Funcion callback
 */
const addTeam = (db, tableName, hashKey, rangeKey, geohash, name, picture,
    ageMinFilter, ageMaxFilter, matchFilter, genderFilter, formation,
    searchingPlayers, fn) => {
    db.putItem({
        TableName: tableName,
        Item: {
            'hashKey': { S: hashKey },
            'rangeKey': { S: rangeKey },
            'geohash': { S: geohash },
            'name': { S: name },
            'picture': { S: picture },
            'ageMinFilter': { N: ageMinFilter },
            'ageMaxFilter': { N: ageMaxFilter },
            'matchFilter': { SS: matchFilter },
            'genderFilter': { SS: genderFilter },
            'formation': { M: formation },
            'searchingPlayers': { BOOL: searchingPlayers }
        }
    }, function(err, data) {
        if (err) fn(err);
        else
            fn(null, {
                id: hashKey.split('#')[1],
                geohash,
                name,
                picture,
                ageMinFilter,
                ageMaxFilter,
                matchFilter,
                genderFilter,
                formation: JSON.stringify(formation),
                searchingPlayers
            });
    });
}

module.exports.addTeam = addTeam;
