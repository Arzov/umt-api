/**
 * Get user
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */

const aws = require('aws-sdk');
const umtEnvs = require('umt-envs');
const dql = require('utils/dql');
let options = umtEnvs.gbl.DYNAMODB_CONFIG;

if (process.env.RUN_MODE === 'LOCAL') options = umtEnvs.dev.DYNAMODB_CONFIG;

const dynamodb = new aws.DynamoDB(options);

exports.handler = (event, context, callback) => {
    const hashKey = `${umtEnvs.pfx.USER}${event.email}`;
    const rangeKey = `${umtEnvs.pfx.METADATA}${event.email}`;

    dql.getUser(dynamodb, process.env.DB_UMT_001, hashKey, rangeKey, callback);
};
