/**
 * Functions
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


// functions

/**
 * Get match info for a list of matches
 * @param   {Object}    lambda  Lambda client
 * @param   {Object}    data    List of matches
 * @param   {Function}  fn      Callback
 */
const getMatches = async (lambda, data, fn) => {

    const matches = [];
    let params = { FunctionName: 'umt-get-match' };

    for (const e in data.Items) {
        params.Payload = JSON.stringify({
            teamId1: data.Items[e].hashKey.S.split('#')[1],
            teamId2: data.Items[e].hashKey.S.split('#')[2],
        });

        matches.push(
            await new Promise((resolve) => {
                lambda.invoke(params, function (err, data) {
                    if (err) fn(err);
                    else resolve(JSON.parse(data.Payload));
                });
            })
        );
    }

    return matches;
};


/**
 * Parse match data
 * @param   {String}    data    Matches data
 * @param   {Function}  fn      Callback
 */
const parseData = (data, fn) => {

    let result = {
        Count: data.Count,
        Items: [],
        LastEvaluatedKey: null,
    };

    if ('LastEvaluatedKey' in data)
        result.LastEvaluatedKey = JSON.stringify(data.LastEvaluatedKey);

    if (result.Count) {
        result.Items = data.Items.map((m) => {
            return {
                teamId1         : m.hashKey.S.split('#')[1],
                teamId2         : m.rangeKey.S.split('#')[1],
                patches         : JSON.stringify(m.patches.M),
                positions       : m.positions.SS,
                matchFilter     : m.matchFilter.SS,
                schedule        : m.schedule.S,
                reqStat         : JSON.stringify(m.reqStat.M),
                stadiumGeohash  : m.stadiumGeohash.S,
                stadiumId       : m.stadiumId.S,
                courtId         : m.courtId.N,
                genderFilter    : m.genderFilter.SS,
                ageMinFilter    : m.ageMinFilter.N,
                ageMaxFilter    : m.ageMaxFilter.N,
                geohash         : m.geohash.S,
                coords          : JSON.stringify(m.coords.M),
                expireOn        : m.expireOn.S,
                createdOn       : m.createdOn.S,
            };
        });
    }

    fn(null, result);
};


// export modules

module.exports.getMatches = getMatches;
module.exports.parseData = parseData;
