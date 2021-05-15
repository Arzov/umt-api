/**
 * Get messages from match's chat
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


// packages

const umtEnvs = require('umt-envs');
const aws = require('aws-sdk');
const dql = require('utils/dql');


// configurations

let optionsDynamodb = umtEnvs.gbl.DYNAMODB_CONFIG;
let limitScan = umtEnvs.gbl.SCAN_LIMIT;

if (process.env.RUN_MODE === 'LOCAL') {

    optionsDynamodb = umtEnvs.dev.DYNAMODB_CONFIG;
    limitScan = umtEnvs.dev.SCAN_LIMIT;

}

const dynamodb = new aws.DynamoDB(optionsDynamodb);


// execution

exports.handler = (event, context, callback) => {

    const hashKey = `${umtEnvs.pfx.MATCH}${event.teamId1}#${event.teamId2}`;
    const nextToken = event.nextToken;

    dql.listMatchChats(
        dynamodb,
        process.env.DB_UMT_001,
        hashKey,
        limitScan,
        nextToken,

        function (err, data) {
            if (err) callback(err);
            else {

                let nextTokenResult = null;
                let dataResult = null;

                if ('LastEvaluatedKey' in data)
                    nextTokenResult = JSON.stringify(data.LastEvaluatedKey);


                // parse response

                if (data.Count)
                    dataResult = data.Items.map(function (matchChat) {
                        return {
                            teamId1     : matchChat.hashKey.S.split('#')[1],
                            teamId2     : matchChat.hashKey.S.split('#')[2],
                            email       : matchChat.GSI1PK.S.split('#')[1],
                            sentOn      : matchChat.sentOn.S,
                            expireOn    : matchChat.expireOn.S,
                            author      : matchChat.author.S,
                            msg         : matchChat.msg.S
                        };
                    });

                callback(null, {
                    items       : dataResult,
                    nextToken   : nextTokenResult,
                });
            }
        }
    );
};
