const aws = require('aws-sdk');
const umtEnvs = require('../../../layers/umt-envs/nodejs/node_modules/umt-envs');
const events = require('../events/events.json');

describe('Test AWS Lambda: umt-add-matchpatch', () => {
    let lambda = new aws.Lambda(umtEnvs.dev.LAMBDA_CONFIG);
    let params = { FunctionName: 'umt-add-matchpatch' };

    test('Evaluate: Patch - Match (svonko.vescovi@arzov.com, MAN. UNITED - REAL MADRID)', (done) => {
        params.Payload = JSON.stringify(events[0]);

        lambda.invoke(params, function (err, data) {
            if (err) {
                console.log(err);
                expect(err.StatusCode).toBe(200);
            } else {
                let response = JSON.parse(data.Payload);

                expect(data.StatusCode).toBe(200);
                expect(response.teamId1).toBe('man.united');
                expect(response.teamId2).toBe('realmadrid');
                expect(response.userEmail).toBe('svonko.vescovi@arzov.com');
                expect(JSON.parse(response.reqStat)).toStrictEqual({
                    MR: { S: 'A' },
                    PR: { S: 'A' },
                });
            }

            done();
        });
    }, 60000);

    test('Evaluate: Match - Patch (MAN. UNITED - REAL MADRID, svonko.vescovi@arzov.com)', (done) => {
        params.Payload = JSON.stringify(events[1]);

        lambda.invoke(params, function (err, data) {
            if (err) {
                console.log(err);
                expect(err.StatusCode).toBe(200);
            } else {
                let response = JSON.parse(data.Payload);

                expect(data.StatusCode).toBe(200);
                expect(JSON.parse(response.reqStat)).toStrictEqual({
                    MR: { S: 'A' },
                    PR: { S: 'A' },
                });
            }

            done();
        });
    }, 60000);

    test('Evaluate: Match - Patch (FC BARCELONA - MAN. UNITED, svonko.vescovi@arzov.com)', (done) => {
        params.Payload = JSON.stringify(events[2]);

        lambda.invoke(params, function (err, data) {
            if (err) {
                console.log(err);
                expect(err.StatusCode).toBe(200);
            } else {
                let response = JSON.parse(data.Payload);

                expect(data.StatusCode).toBe(200);
                expect(JSON.parse(response.reqStat)).toStrictEqual({
                    MR: { S: 'A' },
                    PR: { S: 'P' },
                });
            }

            done();
        });
    }, 60000);
});
