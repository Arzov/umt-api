/**
 * Queries sobre AWS DynamoDB
 * @version 1.0.0
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


/**
 * Actualiza información del usuario
 * @param {Object} db Conexion a DynamoDB
 * @param {String} tableName Nombre de la tabla
 * @param {String} hashKey Hash de geolocaliazción
 * @param {String} rangeKey Email del usuario
 * @param {String} genderFilter Filtro de sexo
 * @param {String} ageMinFilter Filtro de edad mínima
 * @param {String} ageMaxFilter Filtro de edad máxima
 * @param {String} matchFilter Tipo de match (5v5, 7v7, 11v11)
 * @param {Function} fn Función callback
 */
const updateUser = (db, tableName, hashKey, rangeKey, genderFilter, ageMinFilter,
    ageMaxFilter, matchFilter, fn) => {
    db.updateItem({
        TableName: tableName,
        Key: {
            "hashKey": { S: hashKey },
            "rangeKey": { S: rangeKey }
        },
        UpdateExpression: "set genderFilter = :v1, ageMinFilter = :v2, ageMaxFilter = :v3, matchFilter = :v4",
        ExpressionAttributeValues: {
            ":v1": { S: genderFilter },
            ":v2": { N: ageMinFilter },
            ":v3": { N: ageMaxFilter },
            ":v4": { S: matchFilter }
        }
    }, function(err, data) {
        if (err) fn(err);
        else fn(null, data);
    });
}

module.exports.updateUser = updateUser;
