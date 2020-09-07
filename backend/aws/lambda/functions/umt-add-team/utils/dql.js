/**
 * Queries sobre AWS DynamoDB
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


/**
 * Agrega un usuario
 * @param {Object} db Conexion a DynamoDB
 * @param {String} tableName Nombre de la tabla
 * @param {String} hashKey Email
 * @param {String} rangeKey Email
 * @param {String} geohash Hash de geolocalizacion
 * @param {Object} coords Coordenadas de latitud y longitud
 * @param {String[]} genderFilter Filtro de sexo
 * @param {String} ageMinFilter Filtro de edad minima
 * @param {String} ageMaxFilter Filtro de edad maxima
 * @param {String[]} matchFilter Filtro de tipo de juego
 * @param {Object} skills Habilidades
 * @param {String[]} positions Posiciones de juego
 * @param {String} foot Pie habil
 * @param {String} weight Peso
 * @param {String} height Estatura
 * @param {Function} fn Funcion callback
 */
const addUser = (db, tableName, hashKey, rangeKey, geohash, coords, genderFilter, ageMinFilter,
    ageMaxFilter, matchFilter, positions, skills, foot, weight, height, fn) => {
    db.putItem({
        TableName: tableName,
        Item: {
            "hashKey": { S: hashKey },
            "rangeKey": { S: rangeKey },
            "geohash": { S: geohash },
            "coords": { M: coords },
            "genderFilter": { SS: genderFilter },
            "ageMinFilter": { N: ageMinFilter },
            "ageMaxFilter": { N: ageMaxFilter },
            "matchFilter": { SS: matchFilter },
            "positions": { SS: positions },
            "skills": { M: skills },
            "foot": { S: foot },
            "weight": { S: weight },
            "height": { S: height }
        }
    }, function(err, data) {
        if (err) fn(err);
        else
            fn(null, {
                email: hashKey.split('#')[1],
                geohash,
                coords,
                ageMinFilter,
                ageMaxFilter,
                genderFilter,
                matchFilter,
                positions,
                skills,
                foot,
                weight,
                height
            });
    });
}

module.exports.addUser = addUser;
