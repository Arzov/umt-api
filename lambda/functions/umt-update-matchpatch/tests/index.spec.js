/**
 * Test: umt-update-matchpatch
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


// packages

const aws = require('aws-sdk');
const umtEnvs = require('../../../layers/umt-envs/nodejs/node_modules/umt-envs');
const events = require('../events/events.json');


// execution

describe('Test AWS Lambda: umt-update-matchpatch', () => {

    let lambda = new aws.Lambda(umtEnvs.dev.LAMBDA_CONFIG);
    let params = { FunctionName: 'umt-update-matchpatch' };


    // test 1

    test('Evaluate: Match - Patch (REAL MADRID - FC BARCELONA, svonko.vescovi@arzov.com)', (done) => {

        params.Payload = JSON.stringify(events[0]);

        lambda.invoke(params, function (err, data) {

            // error

            if (err) {
                console.log(err);
                expect(err.StatusCode).toBe(200);
            }

            // success

            else {
                const response = JSON.parse(data.Payload);

                expect(data.StatusCode).toBe(200);
                expect(response.teamId1).toBe('realmadrid');
                expect(response.teamId2).toBe('fcbarcelona');
                expect(response.email).toBe('svonko.vescovi@arzov.com');
                expect(response.name).toBe('Svonko');
                expect(JSON.parse(response.reqStat)).toStrictEqual({
                    MR: { S: 'A' },
                    PR: { S: 'A' },
                });
            }

            done();
        });
    }, 60000);


    // test 2

    test('Evaluate: Match - Patch (REAL MADRID - FC BARCELONA, svonko.vescovi@arzov.com)', (done) => {

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
                expect(response.teamId1).toBe('realmadrid');
                expect(response.teamId2).toBe('fcbarcelona');
                expect(response.email).toBe('svonko.vescovi@arzov.com');
            }

            done();
        });
    }, 60000);

});
