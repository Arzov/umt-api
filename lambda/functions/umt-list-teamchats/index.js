/**
 * Get messages from team's chat
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

    const hashKey = `${umtEnvs.pfx.TEAM}${event.id}`;
    const nextToken = event.nextToken;

    dql.listTeamChats(
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
                    dataResult = data.Items.map(function (teamChat) {
                        return {
                            teamId      : teamChat.hashKey.S.split('#')[1],
                            email       : teamChat.GSI1PK.S.split('#')[1],
                            sentOn      : teamChat.sentOn.S,
                            expireOn    : teamChat.expireOn.S,
                            author      : teamChat.author.S,
                            msg         : teamChat.msg.S,
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
