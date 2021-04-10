/**
 * Functions
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */

const umtUtils = require('umt-utils');

/**
 * Filter already joined matches
 * @param {Object} lambda Lambda client
 * @param {String} data List of matches
 * @param {String} email User email
 * @param {Function} callback Callback
 */
const filterJoinedMatches = async (lambda, data, email, callback) => {
    const matches = [];
    let params = { FunctionName: 'umt-get-matchpatch' };

    for (const e in data) {
        params.Payload = JSON.stringify({
            teamId1: data[e].teamId1,
            teamId2: data[e].teamId2,
            email,
        });

        const result = await new Promise((resolve) => {
            lambda.invoke(params, function (err, data) {
                if (err) callback(err);
                else resolve(JSON.parse(data.Payload));
            });
        });

        const isEmpty = umtUtils.isObjectEmpty(result);

        if (isEmpty) matches.push(data[e]);
    }

    return matches;
};

module.exports.filterJoinedMatches = filterJoinedMatches;
