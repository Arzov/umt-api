/**
 * Functions
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


// packages

const umtUtils = require('umt-utils');


// functions

/**
 * Indicates if the user belong to a given team
 * @param   {Object}    lambda  Lambda client
 * @param   {String}    teamId  Team id
 * @param   {String}    email   User email
 */
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

    return (
        !umtUtils.isObjectEmpty(result) &&
        result.reqStat.PR == 'A' &&
        result.reqStat.TR == 'A'
    );

};


/**
 * Get match's patch information if exist
 * @param   {Object}    lambda  Lambda client
 * @param   {String}    teamId1 Applicant team id
 * @param   {String}    teamId2 Requested team id
 * @param   {String}    email   User email
 */
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


/**
 * Get match information
 * @param   {Object}    lambda  Lambda client
 * @param   {String}    teamId1 Applicant team id
 * @param   {String}    teamId2 Requested team id
 */
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


/**
 * Update match information
 * @param   {Object}    lambda  Lambda client
 * @param   {Object}    match   Match information to update
 */
const updateMatch = async (lambda, match) => {

    match.patches.CP.N = String(match.patches.CP.N);
    match.patches.NP.N = String(match.patches.NP.N);

    let params = { FunctionName: 'umt-update-match' };

    params.Payload = JSON.stringify({
        teamId1         : match.teamId1,
        teamId2         : match.teamId2,
        patches         : JSON.stringify(match.patches),
        positions       : match.positions,
        matchFilter     : match.matchFilter,
        ageMinFilter    : match.ageMinFilter,
        ageMaxFilter    : match.ageMaxFilter,
        schedule        : match.schedule,
        reqStat         : match.reqStat,
        stadiumGeohash  : match.stadiumGeohash,
        stadiumId       : match.stadiumId,
        courtId         : match.courtId,
        genderFilter    : match.genderFilter,
    });

    const result = await new Promise((resolve, reject) => {
        lambda.invoke(params, function (err, data) {
            if (err) reject(err);
            else resolve(JSON.parse(data.Payload));
        });
    });

    return result;

};


// export modules

module.exports.belongToTeam = belongToTeam;
module.exports.getMatchPatch = getMatchPatch;
module.exports.getMatch = getMatch;
module.exports.updateMatch = updateMatch;
