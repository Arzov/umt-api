/**
 * Test: umt-add-teamchat
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


// packages

const aws = require('aws-sdk');
const umtEnvs = require('../../../layers/umt-envs/nodejs/node_modules/umt-envs');
const events = require('../events/events.json');


// execution

describe('Test AWS Lambda: umt-add-teamchat', () => {

    let lambda = new aws.Lambda(umtEnvs.dev.LAMBDA_CONFIG);
    let params = { FunctionName: 'umt-add-teamchat' };


    // test 1

    test('Evaluate: Team - Member (MAN. UNITED - matias.barrientos@arzov.com)', (done) => {

        params.Payload = JSON.stringify(events[0]);

        lambda.invoke(params, function (err, data) {

            // error

            if (err) {
                console.log(err);
                expect(err.StatusCode).toBe(200);
            }

            // success

            else {
                let response = JSON.parse(data.Payload);

                expect(data.StatusCode).toBe(200);
                expect(response.teamId).toBe('man.united');
                expect(response.email).toBe('matias.barrientos@arzov.com');
                expect(response.msg).toBe('Jajajaja');
            }

            done();
        });
    }, 60000);


    // test 2

    test('Evaluate: Team - Member (MAN. UNITED - franco.barrientos@arzov.com)', (done) => {

        params.Payload = JSON.stringify(events[1]);

        lambda.invoke(params, function (err, data) {

            // error

            if (err) {
                console.log(err);
                expect(err.StatusCode).toBe(200);
            }

            // success

            else {
                let response = JSON.parse(data.Payload);

                expect(data.StatusCode).toBe(200);
                expect(response.teamId).toBe('man.united');
                expect(response.email).toBe('franco.barrientos@arzov.com');
                expect(response.msg).toBe('Buena cabros! Alguien juega?');
            }

            done();
        });
    }, 60000);
});
