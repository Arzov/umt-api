/**
 * Add a new court into the stadium/sport club
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


// packages

const umtEnvs = require('umt-envs');
const aws = require('aws-sdk');
const dql = require('utils/dql');


// configurations

let options = umtEnvs.gbl.DYNAMODB_CONFIG;

if (process.env.RUN_MODE === 'LOCAL') options = umtEnvs.dev.DYNAMODB_CONFIG;

const dynamodb = new aws.DynamoDB(options);


// execution

exports.handler = function (event, context, callback) {

    const hashKey = `${umtEnvs.pfx.STADIUM}${event.stadiumId}`;
    const matchFilter = event.matchFilter;
    const material = event.material;
    const createdOn = new Date().toISOString();

    let rangeKey = `${umtEnvs.pfx.COURT}${event.stadiumGeohash}`;


    // get `id` of latest court added, to generate a new `id`

    dql.getLastCourtId(
        dynamodb,
        process.env.DB_UMT_001,
        hashKey,
        rangeKey,

        function (err, lastId) {
            if (err) callback(err);
            else {
                rangeKey = `${rangeKey}#${lastId + 1}`;

                dql.addCourt(
                    dynamodb,
                    process.env.DB_UMT_001,
                    hashKey,
                    rangeKey,
                    matchFilter,
                    material,
                    createdOn,
                    callback
                );
            }
        }

    );

};
