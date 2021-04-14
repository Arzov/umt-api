/**
 * Get near teams for team/player position
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */

const umtEnvs = require('umt-envs');
const umtUtils = require('umt-utils');
const aws = require('aws-sdk');
const dql = require('utils/dql');

let limitScan = umtEnvs.gbl.SCAN_LIMIT;
let optionsDynamodb = umtEnvs.gbl.DYNAMODB_CONFIG;
let optionsLambda = umtEnvs.gbl.LAMBDA_CONFIG;

if (process.env.RUN_MODE === 'LOCAL') {
    optionsDynamodb = umtEnvs.dev.DYNAMODB_CONFIG;
    optionsLambda = umtEnvs.dev.LAMBDA_CONFIG;
    limitScan = umtEnvs.dev.SCAN_LIMIT;
}

const dynamodb = new aws.DynamoDB(optionsDynamodb);
const lambda = new aws.Lambda(optionsLambda);

exports.handler = (event, context, callback) => {
    const email = event.email;
    const geohash = event.geohash;
    const forJoin = event.forJoin; // true: search team for join, false: search teams to play with
    const gender = event.gender;
    const age = String(event.age);
    const genderFilter = event.genderFilter;
    const ageMinFilter = String(event.ageMinFilter);
    const ageMaxFilter = String(event.ageMaxFilter);

    let ownTeams = event.ownTeams ? event.ownTeams : [''];
    let matchFilter = event.matchFilter;
    let nextToken = event.nextToken;

    // Fill with ' ' array 'matchFilter' of size 3
    const l = 3 - matchFilter.length;
    for (let i = 0; i < l; i++) {
        matchFilter.push(' ');
    }

    // Prefix to id
    ownTeams = ownTeams.map(function (teamId) {
        return `${umtEnvs.pfx.METADATA}${teamId}`;
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

    dql.nearTeams(
        dynamodb,
        process.env.DB_UMT_001,
        geohash,
        forJoin,
        ownTeams,
        gender,
        age,
        genderFilter,
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
                    if (forJoin) {
                        // Filter teams that already has a request with the user
                        for (const i in data.Items) {
                            const team = data.Items[i];

                            let params = { FunctionName: 'umt-get-teammember' };

                            params.Payload = JSON.stringify({
                                teamId: team.hashKey.S.split('#')[1],
                                email,
                            });

                            const result = await new Promise(
                                (resolve, reject) => {
                                    lambda.invoke(params, function (err, data) {
                                        if (err) reject(err);
                                        else resolve(JSON.parse(data.Payload));
                                    });
                                }
                            );

                            if (umtUtils.isObjectEmpty(result))
                                dataResult.push({
                                    id: team.hashKey.S.split('#')[1],
                                    name: team.name.S,
                                    picture: team.picture.S,
                                    formation: JSON.stringify(team.formation.M),
                                    geohash: team.geohash.S,
                                    coords: JSON.stringify(team.coords.M),
                                    ageMinFilter: team.ageMinFilter.N,
                                    ageMaxFilter: team.ageMaxFilter.N,
                                    genderFilter: team.genderFilter.SS,
                                    matchFilter: team.matchFilter.SS,
                                });
                        }
                    } else {
                        ownTeams = ownTeams.map(function (teamId) {
                            return `${umtEnvs.pfx.TEAM}${teamId.split('#')[1]}`;
                        });

                        // Filter teams that already has a match with user's teams
                        for (const i in data.Items) {
                            const team = data.Items[i];
                            const existMatch = await dql.existMatches(
                                dynamodb,
                                process.env.DB_UMT_001,
                                team.hashKey.S,
                                ownTeams,
                                limitScan,
                                null
                            );

                            if (!existMatch)
                                dataResult.push({
                                    id: team.hashKey.S.split('#')[1],
                                    name: team.name.S,
                                    picture: team.picture.S,
                                    formation: JSON.stringify(team.formation.M),
                                    geohash: team.geohash.S,
                                    coords: JSON.stringify(team.coords.M),
                                    ageMinFilter: team.ageMinFilter.N,
                                    ageMaxFilter: team.ageMaxFilter.N,
                                    genderFilter: team.genderFilter.SS,
                                    matchFilter: team.matchFilter.SS,
                                });
                        }
                    }
                }

                callback(null, {
                    items: dataResult,
                    nextToken: nextTokenResult,
                });
            }
        }
    );
};
