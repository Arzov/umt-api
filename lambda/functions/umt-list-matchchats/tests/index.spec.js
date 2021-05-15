/**
 * Test: umt-list-matchchats
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


// packages

const aws = require('aws-sdk');
const umtEnvs = require('../../../layers/umt-envs/nodejs/node_modules/umt-envs');
const events = require('../events/events.json');


// execution

describe('Test AWS Lambda: umt-list-matchchats', () => {

    let lambda = new aws.Lambda(umtEnvs.dev.LAMBDA_CONFIG);
    let params = { FunctionName: 'umt-list-matchchats' };


    // test 1

    test('Evaluate: Match (MAN. UNITED - REAL MADRID)', (done) => {

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

                expect(response.items[0].teamId1).toBe('man.united');
                expect(response.items[0].teamId2).toBe('realmadrid');
                expect(response.items[0].email).toBe('franco.barrientos@arzov.com');
                expect(response.items[0].author).toBe('Franco');
                expect(response.items[0].msg).toBe(
                    'A que hora jugamos?'
                );

                expect(response.items[1].teamId1).toBe('man.united');
                expect(response.items[1].teamId2).toBe('realmadrid');
                expect(response.items[1].email).toBe('svonko.vescovi@arzov.com');
                expect(response.items[1].author).toBe('Svonko');
                expect(response.items[1].msg).toBe(
                    'Hola, como estan?'
                );

            }

            done();
        });

    }, 60000);

});
