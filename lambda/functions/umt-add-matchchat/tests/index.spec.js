/**
 * Test: umt-add-matchchat
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


// packages

const aws = require('aws-sdk');
const umtEnvs = require('../../../layers/umt-envs/nodejs/node_modules/umt-envs');
const events = require('../events/events.json');


// execution

describe('Test AWS Lambda: umt-add-matchchat', () => {

    let lambda = new aws.Lambda(umtEnvs.dev.LAMBDA_CONFIG);
    let params = { FunctionName: 'umt-add-matchchat' };


    // test 1

    test('Evaluate: Match - Player (MAN. UNITED - REAL MADRID, svonko.vescovi@arzov.com)', (done) => {

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
                expect(response.teamId1).toBe('man.united');
                expect(response.teamId2).toBe('realmadrid');
                expect(response.email).toBe('svonko.vescovi@arzov.com');
                expect(response.author).toBe('Svonko');
                expect(response.msg).toBe('Hola, como estan?');
                expect(response.expireOn).toBe('2021-04-04T20:36:57.562Z');
            }

            done();
        });
    }, 60000);


    // test 2

    test('Evaluate: Match - Player (MAN. UNITED - REAL MADRID, franco.barrientos@arzov.com)', (done) => {

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
                expect(response.teamId1).toBe('man.united');
                expect(response.teamId2).toBe('realmadrid');
                expect(response.email).toBe('franco.barrientos@arzov.com');
                expect(response.author).toBe('Franco');
                expect(response.msg).toBe('A que hora jugamos?');
                expect(response.expireOn).toBe('2021-04-04T20:36:57.562Z');
            }

            done();
        });
    }, 60000);
});
