/**
 * Get near teams for team/player position
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */

const umtEnvs = require('umt-envs');
const aws = require('aws-sdk');
const dql = require('utils/dql');

let limitScan = umtEnvs.gbl.SCAN_LIMIT;
let options = umtEnvs.gbl.DYNAMODB_CONFIG;

if (process.env.RUN_MODE === 'LOCAL') {
    options = umtEnvs.dev.DYNAMODB_CONFIG;
    limitScan = umtEnvs.dev.SCAN_LIMIT;
}

const dynamodb = new aws.DynamoDB(options);

exports.handler = (event, context, callback) => {
    let ownTeams = event.ownTeams ? event.ownTeams : [''];
    const geohash = event.geohash;
    const forJoin = event.forJoin; // true: search team for join, false: search teams to play with
    const gender = event.gender;
    const age = String(event.age);
    const genderFilter = event.genderFilter;
    const ageMinFilter = String(event.ageMinFilter);
    const ageMaxFilter = String(event.ageMaxFilter);
    let matchFilter = event.matchFilter;
    let nextToken = event.nextToken;

    // Fill with ' ' array 'matchFilter' of size 3
    const l = 3 - matchFilter.length;
    for (let i = 0; i < l; i++) {
        matchFilter.push(' ');
    }

    // Prefix to id
    ownTeams = ownTeams.map(function (x) {
        return `${umtEnvs.pfx.TEAM}${x}`;
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
        function (err, data) {
            if (err) callback(err);
            else {
                let nextTokenResult = null;
                let dataResult = [];

                if ('LastEvaluatedKey' in data)
                    nextTokenResult = JSON.stringify(data.LastEvaluatedKey);

                if (data.Count) {
                    dataResult = data.Items.map(function (x) {
                        return {
                            id: x.hashKey.S.split('#')[1],
                            name: x.name.S,
                            picture: x.picture.S,
                            formation: JSON.stringify(x.formation.M),
                            geohash: x.geohash.S,
                            coords: JSON.stringify(x.coords.M),
                            ageMinFilter: x.ageMinFilter.N,
                            ageMaxFilter: x.ageMaxFilter.N,
                            genderFilter: x.genderFilter.SS,
                            matchFilter: x.matchFilter.SS,
                        };
                    });
                }

                callback(null, {
                    items: dataResult,
                    nextToken: nextTokenResult,
                });
            }
        }
    );
};
