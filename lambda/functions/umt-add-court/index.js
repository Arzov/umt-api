/**
 * Add a new sport club's court
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */

const aws = require('aws-sdk');
const umtEnvs = require('umt-envs');
const dql = require('utils/dql');
let options = umtEnvs.gbl.DYNAMODB_CONFIG;

if (process.env.RUN_MODE === 'LOCAL') options = umtEnvs.dev.DYNAMODB_CONFIG;

const dynamodb = new aws.DynamoDB(options);

exports.handler = function (event, context, callback) {
    const hashKey = `${umtEnvs.pfx.STAD}${event.stadiumId}`;
    const matchFilter = event.matchFilter;
    const material = event.material ? event.material : umtEnvs.dft.MATERIAL;

    // Get `id` of latest court added, to generate a new `id`
    dql.getLastCourtId(
        dynamodb,
        process.env.DB_UMT_001,
        hashKey,
        function (err, lastId) {
            if (err) callback(err);
            else {
                const rangeKey = `${umtEnvs.pfx.COURT}${event.stadiumGeohash}#${
                    lastId + 1
                }`;

                dql.addCourt(
                    dynamodb,
                    process.env.DB_UMT_001,
                    hashKey,
                    rangeKey,
                    matchFilter,
                    material,
                    callback
                );
            }
        }
    );
};
