/**
 * Test: umt-matchpatch-requests
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


// packages

const aws = require('aws-sdk');
const umtEnvs = require('../../../layers/umt-envs/nodejs/node_modules/umt-envs');
const events = require('../events/events.json');


// execution

describe('Test AWS Lambda: umt-matchpatch-requests', () => {

    let lambda = new aws.Lambda(umtEnvs.dev.LAMBDA_CONFIG);
    let params = { FunctionName: 'umt-matchpatch-requests' };


    // test 1

    test('Evaluate: User (svonko.vescovi@arzov.com)', (done) => {

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
                expect(response.items[0].teamId1).toBe('realmadrid');
                expect(response.items[0].teamId2).toBe('fcbarcelona');
                expect(response.items[0].email).toBe('svonko.vescovi@arzov.com');
                expect(response.items[0].name).toBe('Svonko');
                expect(JSON.parse(response.items[0].reqStat)).toStrictEqual({
                    MR: { S: 'A' },
                    PR: { S: 'P' },
                });
                expect(response.nextToken).toBe(null);
            }

            done();
        });
    }, 60000);
});
