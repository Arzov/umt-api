/**
 * Acutaliza informacion del partido
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


const aws = require('aws-sdk');
const umtEnvs = require('umt-envs');
const moment = require('moment');
const dql = require('utils/dql');
let options = umtEnvs.gbl.DYNAMODB_CONFIG;

if (process.env.RUN_MODE === 'LOCAL') options = umtEnvs.dev.DYNAMODB_CONFIG;

const dynamodb = new aws.DynamoDB(options);


exports.handler = function(event, context, callback) {
	const hashKey = `${umtEnvs.pfx.MATCH}${event.teamId1}`;
	const rangeKey = `${umtEnvs.pfx.MATCH}${event.teamId2}`;
	const allowedPatches = String(event.allowedPatches);
	const positions = event.positions;
	const matchTypes = event.matchTypes;
	const schedule = JSON.parse(event.schedule);
	const reqStat = JSON.parse(event.reqStat);
	const stadiumGeohash = event.stadiumGeohash;
	const stadiumId = event.stadiumId;
	const courtId = String(event.courtId);
	const genderFilter = event.genderFilter;
	const currDate = moment().format();

    dql.getMatch(dynamodb, process.env.DB_UMT_001, hashKey, rangeKey, function(err, data) {
        if (err) callback(err);
        else {
            // Aun existe la solicitud
			if (Object.entries(data).length > 0 && data.constructor === Object) {
				if (reqStat.AR.S === 'C' || reqStat.AR.S === 'D' ||
					reqStat.RR.S === 'C' || reqStat.RR.S === 'D' ||
					currDate >= data.Item.expireOn.S)
					dql.deleteMatch(dynamodb, process.env.DB_UMT_001, hashKey, rangeKey, callback);
				else
					dql.updateMatch(dynamodb, process.env.DB_UMT_001, hashKey, rangeKey, allowedPatches,
						positions, matchTypes, schedule, reqStat, stadiumGeohash, stadiumId, courtId,
						genderFilter, callback);
			}

            // La solicitud ya no existe
            else callback(null, {teamId1: ''});
        }
	});
};
