/**
 * Queries sobre AWS DynamoDB
 * @version 1.0.0
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


/**
 * Elimina un usuario
 * @param {Object} db Conexion a DynamoDB
 * @param {String} tableName Nombre de la tabla
 * @param {String} hashKey Hash de geolocalización
 * @param {String} rangeKey Email del usuario
 * @param {Function} fn Función callback
 */
const deleteLocation = (db, tableName, hashKey, rangeKey, fn) => {
	db.deleteItem({
		TableName: tableName,
		Key: {
			"hashKey": { S: hashKey },
			"rangeKey": { S: rangeKey }
		}
	}, function(err, data) {
		if (err) fn(err);
		else fn(null, data);
	});
}

/**
 * Obtiene información de un usuario
 * @param {Object} db Conexion a DynamoDB
 * @param {String} tableName Nombre de la tabla
 * @param {String} rangeKey Email del usuario
 * @param {Function} fn Función callback
 */
const getUser = (db, tableName, rangeKey, fn) => {
	db.query({
		TableName: tableName,
		IndexName: "rangeKey-index",
		KeyConditionExpression: "rangeKey = :v1",
		ExpressionAttributeValues: {
			":v1": { S: rangeKey }
		}
	}, function(err, data) {
		if (err) fn(err);
		else fn(null, data);
	});
}

/**
 * Agrega un usuario con su geolocalización
 * @param {Object} db Conexion a DynamoDB
 * @param {String} tableName Nombre de la tabla
 * @param {String} hashKey Hash de geolocalización
 * @param {String} rangeKey Email del usuario
 * @param {String} geoJson Longitud y latitud de la ubicación
 * @param {String} genderFilter Email del usuario
 * @param {String} ageMinFilter Email del usuario
 * @param {String} ageMaxFilter Email del usuario
 * @param {String} matchFilter Email del usuario
 * @param {Function} fn Función callback
 */
const addUser = (db, tableName, hashKey, rangeKey, geoJson, genderFilter, ageMinFilter,
    ageMaxFilter, matchFilter, callback) => {
    db.putItem({
        TableName: tableName,
        Item: {
            "hashKey": { S: hashKey },
            "rangeKey": { S: rangeKey },
            "geoJson": { S: geoJson },
            "genderFilter": { S: genderFilter },
            "ageMinFilter": { N: ageMinFilter },
            "ageMaxFilter": { N: ageMaxFilter },
            "matchFilter": { S: matchFilter }
        }
    }, function(err, data) {
        if (err) callback(err);
        else {
            callback(null, {
                hashKey,
                rangeKey,
                geoJson: JSON.parse(geoJson).coordinates,
                genderFilter,
                ageMinFilter,
                ageMaxFilter,
                matchFilter
            });
        }
    });
}

module.exports.deleteLocation = deleteLocation;
module.exports.getUser = getUser;
module.exports.addUser = addUser;
