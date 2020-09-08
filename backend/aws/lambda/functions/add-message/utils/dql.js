/**
 * Queries sobre AWS DynamoDB
 * @version 1.0.0
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


/**
 * Agrega mensaje al chat
 * @param {Object} db Conexion a DynamoDB
 * @param {String} tableName Nombre de la tabla
 * @param {String} hashKey Id del mensaje (id del match)
 * @param {String} rangeKey Fecha de cración del mensaje + el email del usuario
 * @param {String} author Autor del mensaje (email del usuario)
 * @param {String} authorName Nombre del autor
 * @param {String} content Mensaje
 * @param {Function} fn Función callback
 */
const addMessage = (db, tableName, hashKey, rangeKey, author, authorName, content, fn) => {
	db.putItem({
		TableName: tableName,
		Item: {
			"hashKey": { S: hashKey },
			"rangeKey": { S: rangeKey },
			"author": { S: author },
			"authorName": { S: authorName },
			"content": { S: content }
		}
	}, function(err, data) {
		if (err) fn(err);
		else fn(null, data);
	});
}

module.exports.addMessage = addMessage;
