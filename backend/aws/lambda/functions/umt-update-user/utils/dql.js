/**
 * Queries sobre AWS DynamoDB
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


/**
 * Actualiza informacion del usuario
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
const updateUser = (db, tableName, hashKey, rangeKey, geohash, coords, genderFilter, ageMinFilter,
    ageMaxFilter, matchFilter, positions, skills, foot, weight, height, fn) => {
    db.updateItem({
        TableName: tableName,
        Key: {
            "hashKey": { S: hashKey },
            "rangeKey": { S: rangeKey }
        },
        UpdateExpression: "set geohash = :v1, coords = :v2, genderFilter = :v3,\
            ageMinFilter = :v4, ageMaxFilter = :v5, matchFilter = :v6, positions = :v7,\
            skills = :v8, foot = :v9, weight = :v10, height = :v11",
        ExpressionAttributeValues: {
            ":v1": { S: geohash },
            ":v2": { M: coords },
            ":v3": { SS: genderFilter },
            ":v4": { N: ageMinFilter },
            ":v5": { N: ageMaxFilter },
            ":v6": { SS: matchFilter },
            ":v7": { SS: positions },
            ":v8": { M: skills },
            ":v9": { S: foot },
            ":v10": { S: weight },
            ":v11": { S: height }
        }
    }, function(err, data) {
        if (err) fn(err);
        else fn(null, {
            email: hashKey.split('#')[1],
            geohash,
            coords: JSON.stringify(coords),
            genderFilter,
            ageMinFilter,
            ageMaxFilter,
            matchFilter,
            positions,
            skills: JSON.stringify(skills),
            foot,
            weight,
            height
        });
    });
}

module.exports.updateUser = updateUser;
