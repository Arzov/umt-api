/**
 * Test: umt-add-court
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


// packages

const aws = require('aws-sdk');
const umtEnvs = require('../../../layers/umt-envs/nodejs/node_modules/umt-envs');
const events = require('../events/events.json');


// execution

describe('Test AWS Lambda: umt-add-court', () => {

    let lambda = new aws.Lambda(umtEnvs.dev.LAMBDA_CONFIG);
    let params = { FunctionName: 'umt-add-court' };


    // test 1

    test('Evaluate: Court (#1)', (done) => {

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
                expect(response.stadiumId).toBe('clubdeportivoindepe');
                expect(response.stadiumGeohash).toBe('66jcfp');
                expect(response.id).toBe('1');
                expect(response.matchFilter).toStrictEqual(['7v7']);
                expect(response.material).toBe('Grass');
            }

            done();
        });
    }, 60000);


    // test 2

    test('Evaluate: Court (#2)', (done) => {

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
                expect(response.stadiumId).toBe('clubdeportivoindepe');
                expect(response.stadiumGeohash).toBe('66jcfp');
                expect(response.id).toBe('2');
                expect(response.matchFilter).toStrictEqual(['5v5']);
                expect(response.material).toBe('Cement');
            }

            done();
        });
    }, 60000);


    // test 3

    test('Evaluate: Court (#3)', (done) => {

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
                expect(response.stadiumId).toBe('clubdeportivoindepe');
                expect(response.stadiumGeohash).toBe('66jcfp');
                expect(response.id).toBe('3');
                expect(response.matchFilter).toStrictEqual(['5v5']);
                expect(response.material).toBe('Wood');
            }

            done();
        });
    }, 60000);
});
