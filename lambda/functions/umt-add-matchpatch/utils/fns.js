/**
 * Functions
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */

const umtUtils = require('umt-utils');

// Indicates if the user belong to a given team
const belongToTeam = async (lambda, teamId, email) => {
    let params = { FunctionName: 'umt-get-teammember' };

    params.Payload = JSON.stringify({
        teamId,
        email,
    });

    const result = await new Promise((resolve, reject) => {
        lambda.invoke(params, function (err, data) {
            if (err) reject(err);
            else resolve(JSON.parse(data.Payload));
        });
    });

    return !umtUtils.isObjectEmpty(result);
};

// Get match's patch information if exist
const getMatchPatch = async (lambda, teamId1, teamId2, email) => {
    let params = { FunctionName: 'umt-get-matchpatch' };

    params.Payload = JSON.stringify({
        teamId1,
        teamId2,
        email,
    });

    let result = await new Promise((resolve, reject) => {
        lambda.invoke(params, function (err, data) {
            if (err) reject(err);
            else resolve(JSON.parse(data.Payload));
        });
    });

    result.isEmpty = umtUtils.isObjectEmpty(result);

    return result;
};

// Get match information
const getMatch = async (lambda, teamId1, teamId2) => {
    let params = { FunctionName: 'umt-get-match' };

    params.Payload = JSON.stringify({
        teamId1,
        teamId2,
    });

    let result = await new Promise((resolve, reject) => {
        lambda.invoke(params, function (err, data) {
            if (err) reject(err);
            else resolve(JSON.parse(data.Payload));
        });
    });

    result.isEmpty = umtUtils.isObjectEmpty(result);

    return result;
};

// Update match information
const updateMatch = async (lambda, match, callback) => {
    match.patches.CP.N = String(match.patches.CP.N);
    match.patches.NP.N = String(match.patches.NP.N);

    let params = { FunctionName: 'umt-update-match' };

    params.Payload = JSON.stringify({
        teamId1: match.teamId1,
        teamId2: match.teamId2,
        patches: JSON.stringify(match.patches),
        positions: match.positions,
        matchFilter: match.matchFilter,
        ageMinFilter: match.ageMinFilter,
        ageMaxFilter: match.ageMaxFilter,
        schedule: match.schedule,
        reqStat: match.reqStat,
        stadiumGeohash: match.stadiumGeohash,
        stadiumId: match.stadiumId,
        courtId: match.courtId,
        genderFilter: match.genderFilter,
    });

    const result = await new Promise((resolve, reject) => {
        lambda.invoke(params, function (err, data) {
            if (err) reject(err);
            else resolve(JSON.parse(data.Payload));
        });
    });

    return result;
};

module.exports.belongToTeam = belongToTeam;
module.exports.getMatchPatch = getMatchPatch;
module.exports.getMatch = getMatch;
module.exports.updateMatch = updateMatch;
