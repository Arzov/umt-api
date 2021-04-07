/**
 * Get near matches for patch
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */

const aws = require('aws-sdk');
const umtEnvs = require('umt-envs');
const dql = require('utils/dql');
let limitScan = umtEnvs.gbl.SCAN_LIMIT;
let optionsDynamodb = umtEnvs.gbl.DYNAMODB_CONFIG;
let optionsLambda = umtEnvs.gbl.LAMBDA_CONFIG;

if (process.env.RUN_MODE === 'LOCAL') {
    optionsDynamodb = umtEnvs.dev.DYNAMODB_CONFIG;
    optionsLambda = umtEnvs.dev.LAMBDA_CONFIG;
    limitScan = umtEnvs.dev.SCAN_LIMIT;
}

const lambda = new aws.Lambda(optionsLambda);
const dynamodb = new aws.DynamoDB(optionsDynamodb);
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

        if (
            Object.entries(result).length <= 0 ||
            result.constructor !== Object
        ) {
            matches.push(data[e]);
        }
    }

    return matches;
};

exports.handler = (event, context, callback) => {
    const email = event.email;
    const geohash = event.geohash;
    const gender = event.gender;
    const ageMinFilter = String(event.ageMinFilter);
    const ageMaxFilter = String(event.ageMaxFilter);
    let ownTeams = event.ownTeams ? event.ownTeams : ['']; // filter player's teams
    let matchFilter = event.matchFilter;
    let nextToken = event.nextToken;
    // TODO: pass age from user to filter too

    // Fill with ' ' array 'matchFilter' of size 3
    const l = 3 - matchFilter.length;
    for (let i = 0; i < l; i++) {
        matchFilter.push(' ');
    }

    // Prefix to id
    ownTeams = ownTeams.map(function (x) {
        return `${umtEnvs.pfx.MATCH}${x}`;
    });

    /**
     * The `geohash` of the `nextToken` must be equal to the `geohash` of the
     * team/user, in case it is not, the `nextToken` is canceled, in this
     * way it is avoided AWS DynamoDB cannot find the correct partition.
     * This may occur due to the team/user moving to another site
     * and change its `geohash`.
     */
    if (nextToken) {
        if (JSON.parse(nextToken).geohash.S !== geohash) nextToken = null;
    }

    dql.nearMatches(
        dynamodb,
        process.env.DB_UMT_001,
        geohash,
        ownTeams,
        gender,
        ageMinFilter,
        ageMaxFilter,
        matchFilter,
        limitScan,
        nextToken,
        async function (err, data) {
            if (err) callback(err);
            else {
                let nextTokenResult = null;
                let dataResult = [];

                if ('LastEvaluatedKey' in data)
                    nextTokenResult = JSON.stringify(data.LastEvaluatedKey);

                if (data.Count) {
                    dataResult = data.Items.map(function (x) {
                        return {
                            teamId1: x.hashKey.S.split('#')[1],
                            teamId2: x.rangeKey.S.split('#')[1],
                            createdOn: x.createdOn.S,
                            patches: JSON.stringify(x.patches.M),
                            positions: x.positions.SS,
                            matchFilter: x.matchFilter.SS,
                            expireOn: x.expireOn.S,
                            schedule: x.schedule.S,
                            reqStat: JSON.stringify(x.reqStat.M),
                            geohash: x.geohash.S,
                            coords: JSON.stringify(x.coords.M),
                            stadiumGeohash: x.stadiumGeohash.S,
                            stadiumId: x.stadiumId.S,
                            courtId: x.courtId.N,
                            ageMinFilter: x.ageMinFilter.N,
                            ageMaxFilter: x.ageMaxFilter.N,
                            genderFilter: x.genderFilter.SS,
                        };
                    });

                    // Drop already joined matches
                    dataResult = await filterJoinedMatches(
                        lambda,
                        dataResult,
                        email,
                        callback
                    );
                }

                callback(null, {
                    items: dataResult,
                    nextToken: nextTokenResult,
                });
            }
        }
    );
};
