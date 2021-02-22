/**
 * Queries sobre AWS DynamoDB
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


/**
 * Agrega un miembro en el equipo
 * @param {Object} db Conexion a DynamoDB
 * @param {String} tableName Nombre de la tabla
 * @param {String} hashKey Id del equipo
 * @param {String} rangeKey Email del usuario
 * @param {Object} position Posicion en la formacion
 * @param {String[]} role Roles
 * @param {Object} reqStat Estado de solicitud
 * @param {String} number Numero de jugador
 * @param {String} joinedOn Fecha de ingreso
 * @param {Function} fn Funcion callback
 */
const addTeamMember = (db, tableName, hashKey, rangeKey, position, role,
    reqStat, number, joinedOn, fn) => {
    db.putItem({
        TableName: tableName,
        Item: {
            hashKey: { S: hashKey },
            rangeKey: { S: rangeKey },
            position: { M: position },
            role: { SS: role },
            reqStat: { M: reqStat },
            number: { N: number },
            joinedOn: { S: joinedOn }
        }
    }, function(err, data) {
        if (err) fn(err);
        else
            fn(null, {
                teamId: hashKey.split('#')[1],
                userEmail: rangeKey.split('#')[1],
                position: JSON.stringify(position),
                role,
                reqStat: JSON.stringify(reqStat),
                number,
                joinedOn
            });
    });
}

module.exports.addTeamMember = addTeamMember;
