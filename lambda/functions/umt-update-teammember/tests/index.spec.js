/**
 * Test: umt-update-teammember
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


// packages

const aws = require('aws-sdk');
const umtEnvs = require('../../../layers/umt-envs/nodejs/node_modules/umt-envs');
const events = require('../events/events.json');


// execution

describe('Test AWS Lambda: umt-update-teammember', () => {

    let lambda = new aws.Lambda(umtEnvs.dev.LAMBDA_CONFIG);
    let params = { FunctionName: 'umt-update-teammember' };


    // test 1

    test('Evaluate: Team - User (FC BARCELONA - franco.barrientos@arzov.com)', (done) => {

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
                expect(response.teamId).toBe('fcbarcelona');
                expect(response.email).toBe('franco.barrientos@arzov.com');
            }

            done();
        });
    }, 60000);


    // test 2

    test('Evaluate: Team - User (MAN. UNITED - jesus.barrientos@arzov.com)', (done) => {

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
                expect(response.email).toBe('jesus.barrientos@arzov.com');
                expect(response.name).toBe('Jesús');
                expect(JSON.parse(response.reqStat)).toStrictEqual({
                    TR: { S: 'A' },
                    PR: { S: 'A' },
                });
                expect(response.role).toStrictEqual(['Player']);
                expect(response.number).toBe('0');
            }

            done();
        });
    }, 60000);


    // test 3

    test('Evaluate: Team - User (FC BARCELONA - svonko.vescovi@arzov.com)', (done) => {

        params.Payload = JSON.stringify(events[2]);

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
                expect(JSON.parse(response.errorMessage)).toStrictEqual({
                    code: 'TeamMemberNotExistException',
                    message: `La solicitud ya no existe.`,
                });
            }

            done();
        });
    }, 60000);
});
