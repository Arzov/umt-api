/**
 * Get match's patch
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

exports.handler = (event, context, callback) => {

    const hashKey = `${umtEnvs.pfx.MATCH}${event.teamId1}#${event.teamId2}`;
    const rangeKey = `${umtEnvs.pfx.MATCH_PATCH}${event.email}`;

    dql.getMatchPatch(
        dynamodb,
        process.env.DB_UMT_001,
        hashKey,
        rangeKey,
        callback
    );
};
