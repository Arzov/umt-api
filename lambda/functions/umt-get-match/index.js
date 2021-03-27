/**
 * Get match
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */

const aws = require('aws-sdk');
const umtEnvs = require('umt-envs');
const dql = require('utils/dql');
let options = umtEnvs.gbl.DYNAMODB_CONFIG;

if (process.env.RUN_MODE === 'LOCAL') options = umtEnvs.dev.DYNAMODB_CONFIG;

const dynamodb = new aws.DynamoDB(options);

exports.handler = (event, context, callback) => {
    const hashKey = `${umtEnvs.pfx.MATCH}${event.teamId1}`;
    const rangeKey = `${umtEnvs.pfx.MATCH}${event.teamId2}`;

    dql.getMatch(dynamodb, process.env.DB_UMT_001, hashKey, rangeKey, callback);
};
