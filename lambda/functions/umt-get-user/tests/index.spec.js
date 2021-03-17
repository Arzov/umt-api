const aws = require('aws-sdk');
const umtEnvs = require('../../../layers/umt-envs/nodejs/node_modules/umt-envs');
const events = require('../events/events.json');

describe('Test AWS Lambda: umt-get-user', () => {
    let lambda = new aws.Lambda(umtEnvs.dev.LAMBDA_CONFIG);
    let params = { FunctionName: 'umt-get-user' };

    test('Evaluate: User (franco.barrientos@arzov.com)', (done) => {
        params.Payload = JSON.stringify(events[0]);

        lambda.invoke(params, function (err, data) {
            if (err) {
                console.log(err);
                expect(err.StatusCode).toBe(400);
            } else {
                let response = JSON.parse(data.Payload);

                expect(data.StatusCode).toBe(200);
                expect(response.email).toBe('franco.barrientos@arzov.com');
                expect(response.geohash).toBe('66jcfp');
                expect(JSON.parse(response.coords)).toStrictEqual({
                    LON: { N: '-70.573615' },
                    LAT: { N: '-33.399435' },
                });
                expect(JSON.parse(response.skills)).toStrictEqual(
                    umtEnvs.dft.USER.SKILLS
                );
                expect(response.ageMinFilter).toBe('22');
                expect(response.ageMaxFilter).toBe('45');
                expect(response.matchFilter).toStrictEqual([
                    '11v11',
                    '5v5',
                    '7v7',
                ]);
                expect(response.positions).toStrictEqual(['CF', 'LW', 'RW']);
                expect(response.foot).toBe('R');
                expect(response.weight).toBe('80');
                expect(response.height).toBe('175');
            }

            done();
        });
    }, 60000);
});
