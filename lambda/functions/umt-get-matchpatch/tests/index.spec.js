const aws = require('aws-sdk');
const umtEnvs = require('../../../layers/umt-envs/nodejs/node_modules/umt-envs');
const events = require('../events/events.json');

describe('Test AWS Lambda: umt-get-matchpatch', () => {
    let lambda = new aws.Lambda(umtEnvs.dev.LAMBDA_CONFIG);
    let params = { FunctionName: 'umt-get-matchpatch' };

    test('Evaluate: Match - Patch (MAN. UNITED - REAL MADRID, svonko.vescovi@arzov.com)', (done) => {
        params.Payload = JSON.stringify(events[0]);

        lambda.invoke(params, function (err, data) {
            if (err) {
                console.log(err);
                expect(err.StatusCode).toBe(400);
            } else {
                let response = JSON.parse(data.Payload);

                expect(data.StatusCode).toBe(200);
                expect(response.teamId1).toBe('man.united');
                expect(response.teamId2).toBe('realmadrid');
                expect(response.email).toBe('svonko.vescovi@arzov.com');
                expect(JSON.parse(response.reqStat)).toStrictEqual({
                    MR: { S: 'A' },
                    PR: { S: 'A' },
                });
            }

            done();
        });
    }, 60000);
});
