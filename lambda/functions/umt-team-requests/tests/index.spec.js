const aws = require('aws-sdk');
const umtEnvs = require('../../../layers/umt-envs/nodejs/node_modules/umt-envs');
const events = require('../events/events.json');

describe('Test AWS Lambda: umt-team-requests', () => {
    let lambda = new aws.Lambda(umtEnvs.dev.LAMBDA_CONFIG);
    let params = { FunctionName: 'umt-team-requests' };

    test('Evaluate: Team (MAN. UNITED)', (done) => {
        params.Payload = JSON.stringify(events[0]);

        lambda.invoke(params, function (err, data) {
            if (err) {
                console.log(err);
                expect(err.StatusCode).toBe(200);
            } else {
                let response = JSON.parse(data.Payload);

                expect(data.StatusCode).toBe(200);
                expect(response.items[0].teamId).toBe('man.united');
                expect(response.items[0].email).toBe(
                    'jesus.barrientos@arzov.com'
                );
                expect(JSON.parse(response.items[0].reqStat)).toStrictEqual({
                    TR: { S: 'P' },
                    PR: { S: 'A' },
                });
                expect(response.nextToken).toBe(null);
            }

            done();
        });
    }, 60000);
});
