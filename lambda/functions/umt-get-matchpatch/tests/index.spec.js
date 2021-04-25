/**
 * Test: umt-get-matchpatch
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


// packages

const aws = require('aws-sdk');
const umtEnvs = require('../../../layers/umt-envs/nodejs/node_modules/umt-envs');
const events = require('../events/events.json');


// execution

describe('Test AWS Lambda: umt-get-matchpatch', () => {

    let lambda = new aws.Lambda(umtEnvs.dev.LAMBDA_CONFIG);
    let params = { FunctionName: 'umt-get-matchpatch' };


    // test 1

    test('Evaluate: Match - Patch (MAN. UNITED - REAL MADRID, svonko.vescovi@arzov.com)', (done) => {

        params.Payload = JSON.stringify(events[0]);

        lambda.invoke(params, function (err, data) {

            // error

            if (err) {
                console.log(err);
                expect(err.StatusCode).toBe(400);
            }

            // success

            else {
                let response = JSON.parse(data.Payload);

                expect(data.StatusCode).toBe(200);
                expect(response.teamId1).toBe('man.united');
                expect(response.teamId2).toBe('realmadrid');
                expect(response.email).toBe('svonko.vescovi@arzov.com');
                expect(JSON.parse(response.reqStat)).toStrictEqual({
                    MR: { S: 'A' },
                    PR: { S: 'A' },
                });
                expect(response.expireOn).toBe('2021-04-04T20:36:57.562Z');
            }

            done();
        });
    }, 60000);
});
