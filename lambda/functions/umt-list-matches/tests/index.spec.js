const aws = require('aws-sdk');
const umtEnvs = require('../../../layers/umt-envs/nodejs/node_modules/umt-envs');
const events = require('../events/events.json');

describe('Test AWS Lambda: umt-list-matches', () => {
    let lambda = new aws.Lambda(umtEnvs.dev.LAMBDA_CONFIG);
    let params = { FunctionName: 'umt-list-matches' };

    test('Evaluate: Team (MAN. UNITED)', (done) => {
        params.Payload = JSON.stringify(events[0]);

        lambda.invoke(params, function (err, data) {
            if (err) {
                console.log(err);
                expect(err.StatusCode).toBe(200);
            } else {
                let response = JSON.parse(data.Payload);

                expect(data.StatusCode).toBe(200);
                expect(response.items[0].teamId1).toBe('man.united');
                expect(response.items[0].teamId2).toBe('realmadrid');
                expect(response.nextToken).toBe('&');
            }

            done();
        });
    }, 60000);

    test('Evaluate: Patch (svonko.vescovi@arzov.com)', (done) => {
        params.Payload = JSON.stringify(events[1]);

        lambda.invoke(params, function (err, data) {
            if (err) {
                console.log(err);
                expect(err.StatusCode).toBe(200);
            } else {
                let response = JSON.parse(data.Payload);

                expect(data.StatusCode).toBe(200);
                expect(response.items[0].teamId1).toBe('man.united');
                expect(response.items[0].teamId2).toBe('realmadrid');
                expect(response.nextToken).toBe(null);
            }

            done();
        });
    }, 60000);
});
