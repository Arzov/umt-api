/**
 * Busca rivales cercanos al usuario
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


const aws = require('aws-sdk');
const dql = require('utils/dql');
const calcs = require('utils/calcs');
const moment = require('moment');
const async = require('async');
let options = { apiVersion: '2012-08-10' }

if (process.env.RUN_MODE === 'LOCAL') {
	options.endpoint = 'http://arzov:8000'
	options.accessKeyId = 'xxxx'
	options.secretAccessKey = 'xxxx'
	options.region = 'localhost'
}

const dynamodb = new aws.DynamoDB(options);
const limitScan = 5;


/**
 * Valida que la información del rival cumpla con los filtros del usuario
 * @param {Object[]} calls Resultados para llamada asincrónica
 * @param {String} hashKey Email del rival
 * @param {String} geoJson Longitud y latitud del rival
 * @param {String} ageMinFilter Filtro mínimo de edad del usuario
 * @param {String} ageMaxFilter Filtro máxima de edad del usuario
 * @param {String} genderFilter Filtro de sexo del usuario
 * @param {String} rangeKey Email del usuario
 * @param {Function} fn Función callback
 */
const validateUser = (calls, hashKey, geoJson, ageMinFilter, ageMaxFilter, genderFilter,
	rangeKey, currentDate) => {
	calls.push(function(callback) {
		// Revisar si ya existe un match entre los usuarios
		dql.getMatch(dynamodb, process.env.DB_UMT_MATCHES, rangeKey, hashKey,
			currentDate, function(err, data) {
			if (err) return callback(err);
			else {
				// Si no existe match seguir con la validacion
				if (!data.Count) {

					if (process.env.RUN_MODE === 'LOCAL') {
						const age = 25;

						if ('M' == genderFilter && age >= ageMinFilter &&
							(age <= ageMaxFilter || ageMaxFilter == 60)) {
							callback(null, {
								hashKey: hashKey,
								firstName: 'Jesús',
								age: age,
								picture: ' ',
								geoJson: JSON.parse(geoJson).coordinates
							});
						}
						else callback(null);

					} else {
						// Obtener informacion del rival encontrado
						dql.getUser(dynamodb, process.env.DB_ARV_USERS, hashKey, function(err, data) {
							if (err) return callback(err);
							else {
								const age = calcs.getAge(data.Item.birthdate.S);

								// Validar que los datos del usuario coincidan con los filtros
								if (data.Item.gender.S == genderFilter && age >= ageMinFilter &&
									(age <= ageMaxFilter || ageMaxFilter == 60)) {
									callback(null, {
										hashKey,
										firstName: data.Item.firstName.S,
										age,
										picture: data.Item.picture.S,
										geoJson: JSON.parse(geoJson).coordinates
									});
								}
								else callback(null);
							}
						});
					}
				}
				else callback(null);
			}
		});
	});
}


exports.handler = function(event, context, callback) {
	const hashKey = event.hashKey;
	const rangeKey = event.rangeKey;
	const birthdate = event.birthdate;
	const gender = event.gender;
	const ageMinFilter = String(event.ageMinFilter);
	const ageMaxFilter = String(event.ageMaxFilter);
	const genderFilter = event.genderFilter;
	const matchFilter = event.matchFilter;
	let nextToken = event.nextToken;
	const age = String(calcs.getAge(birthdate));
	const currentDate = moment().format();

	/**
	 * El hashKey del nextToken debe ser igual al hashKey del usuario, en caso que no sea
	 * se anula el nextToken, de esta manera se evita que AWS DynamoDB no pueda encontrar
	 * la particion correcta. Esto ocurre cuando el usuario se mueve o cambia de ubicación.
	 */
	if (nextToken) {
		if (Number(JSON.parse(nextToken).hashKey.N) !== Number(hashKey)) {
			nextToken = null;
		}
	}

	// Tareas asincronicas
	let calls = [];

	// Buscar rivales donde sus filtros coincidan con la edad, sexo y tipo de match del usuario
	dql.getMatchingUsers(dynamodb, process.env.DB_UMT_USERS, hashKey, age, gender, matchFilter,
		limitScan, nextToken, function(err, data) {
		if (err) callback(err);
		else {
			let nextTokenResult = null;

			if ('LastEvaluatedKey' in data) {
				nextTokenResult = JSON.stringify(data.LastEvaluatedKey);
			}

			// Validar rivales encontrados en cuanto a filtro edad y filtro sexo del usuario
			for (let i = 0; i < data.Count; i++) {
				// Revisar que el usuario no sea el mismo
				if (rangeKey !== data.Items[i].rangeKey.S) {
					validateUser(calls, data.Items[i].rangeKey.S, data.Items[i].geoJson.S,
						ageMinFilter, ageMaxFilter, genderFilter, rangeKey, currentDate);
				}
			}

			// Espera que valide a los usuarios
			async.parallel(calls, function(err, result) {
				if (err) callback(err);
				else {
					const data = result.filter(function(el) {
						return el != null;
					});

					callback(null, {
						items: data,
						nextToken: nextTokenResult
					});
				}
			});
		}
	});
};
