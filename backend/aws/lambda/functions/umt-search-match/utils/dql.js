/**
 * Queries sobre AWS DynamoDB
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


/**
 * Obtiene rivales que sus filtros coincidan con el usuario
 * @param {Object} db Conexion a DynamoDB
 * @param {String} tableName Nombre de la tabla
 * @param {String} hashKey Hash de geolocalización
 * @param {String} age Edad del usuario solicitante
 * @param {String} gender Sexo del usuario
 * @param {String} matchFilter Tipo de match que busca
 * @param {Integer} limitScan Límite de matches a obtener para paginación
 * @param {String} nextToken Último match para paginación
 * @param {Function} fn Función callback
 */
const getMatchingUsers = (db, tableName, hashKey, age, gender, matchFilter, limitScan, nextToken, fn) => {
	if (nextToken) {
		db.query({
			TableName: tableName,
			KeyConditionExpression: "hashKey = :v1",
			FilterExpression: "ageMinFilter <= :v2 and (ageMaxFilter >= :v2 or ageMaxFilter = :v5) and genderFilter = :v3 and matchFilter = :v4",
			ExpressionAttributeValues: {
				":v1": { S: hashKey },
				":v2": { N: age },
				":v3": { S: gender },
				":v4": { S: matchFilter },
				":v5": { N: "60" }
			},
			ExclusiveStartKey: JSON.parse(nextToken),
			Limit: limitScan
		}, function(err, data) {
			if (err) fn(err);
			else fn(null, data);
		});
	}
	else {
		db.query({
			TableName: tableName,
			KeyConditionExpression: "hashKey = :v1",
			FilterExpression: "ageMinFilter <= :v2 and (ageMaxFilter >= :v2 or ageMaxFilter = :v5) and genderFilter = :v3 and matchFilter = :v4",
			ExpressionAttributeValues: {
				":v1": { S: hashKey },
				":v2": { N: age },
				":v3": { S: gender },
				":v4": { S: matchFilter },
				":v5": { N: "60" }
			},
			Limit: limitScan
		}, function(err, data) {
			if (err) fn(err);
			else fn(null, data);
		});
	}
}

/**
 * Obtiene información del usuario
 * @param {Object} db Conexion a DynamoDB
 * @param {String} tableName Nombre de la tabla
 * @param {String} hashKey Email del usuario
 * @param {Function} fn Función callback
 */
const getUser = (db, tableName, hashKey, fn) => {
	db.getItem({
			TableName: tableName,
			Key: {
				"hashKey": { S: hashKey }
			}
		},
		function(err, data) {
			if (err) fn(err);
			else fn(null, data);
		});
}

/**
 * Obtiene match entre usuarios
 * @param {Object} db Conexion a DynamoDB
 * @param {String} tableName Nombre de la tabla
 * @param {String} hashKey Email del usuario
 * @param {String} rangeKey Email del rival
 * @param {String} currentDate Fecha actual para filtrar match expirado
 * @param {Function} fn Función callback
 */
const getMatch = (db, tableName, hashKey, rangeKey, currentDate, fn) => {
	db.query({
		TableName: tableName,
		KeyConditionExpression: "hashKey = :v1 and rangeKey = :v2",
		FilterExpression: "expireAt >= :v3",
		ExpressionAttributeValues: {
			":v1": { S: hashKey },
			":v2": { S: rangeKey },
			":v3": { S: currentDate }
		}
	}, function(err, data) {
		if (err) fn(err);
		else fn(null, data);
	});
}

module.exports.getMatchingUsers = getMatchingUsers;
module.exports.getUser = getUser;
module.exports.getMatch = getMatch;
