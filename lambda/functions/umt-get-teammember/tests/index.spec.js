const aws = require('aws-sdk');
const umtEnvs = require('../../../layers/umt-envs/nodejs/node_modules/umt-envs');
const events = require('../events/events.json');

describe('Test AWS Lambda: umt-get-teammember', () => {
    let lambda = new aws.Lambda(umtEnvs.dev.LAMBDA_CONFIG);
    let params = { FunctionName: 'umt-get-teammember' };

    test('Evaluate: Team - User (REAL MADRID, ivo.farias@arzov.com)', (done) => {
        params.Payload = JSON.stringify(events[0]);

        lambda.invoke(params, function (err, data) {
            if (err) {
                console.log(err);
                expect(err.StatusCode).toBe(400);
            } else {
                let response = JSON.parse(data.Payload);

                expect(data.StatusCode).toBe(200);
                expect(response.teamId).toBe('realmadrid');
                expect(response.email).toBe('ivo.farias@arzov.com');
                expect(JSON.parse(response.reqStat)).toStrictEqual({
                    TR: { S: 'A' },
                    PR: { S: 'A' },
                });
                expect(response.role).toStrictEqual([
                    'Admin',
                    'Captain',
                    'Player',
                ]);
                expect(response.number).toBe('0');
            }

            done();
        });
    }, 60000);
});
