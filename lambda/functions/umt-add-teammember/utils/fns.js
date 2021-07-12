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
        JSON.parse(result.reqStat).PR.S == 'A' &&
        JSON.parse(result.reqStat).TR.S == 'A'
    );

};


// export modules

module.exports.belongToTeam = belongToTeam;
