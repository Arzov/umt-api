/**
 * Cálculos varios
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


/**
 * Obtiene la edad a partir de la fecha de nacimiento
 * @param {String} dateString Fecha de nacimiento (yyyy-mm-dd)
 */
const getAge = (dateString) => {
	var birthday = +new Date(dateString);
	return ~~((Date.now() - birthday) / (31557600000));
}

module.exports.getAge = getAge;
