const aws = require('aws-sdk');
const umtEnvs = require('../../../layers/umt-envs/nodejs/node_modules/umt-envs');
const events = require('../events/events.json');

describe('Test AWS Lambda: umt-get-team', () => {
    let lambda = new aws.Lambda(umtEnvs.dev.LAMBDA_CONFIG);
    let params = { FunctionName: 'umt-get-team' };

    test('Evaluate: Team (MAN. UNITED)', (done) => {
        params.Payload = JSON.stringify(events[0]);

        lambda.invoke(params, function (err, data) {
            if (err) {
                console.log(err);
                expect(err.StatusCode).toBe(400);
            } else {
                let response = JSON.parse(data.Payload);

                expect(data.StatusCode).toBe(200);
                expect(response.id).toBe('man.united');
                expect(response.geohash).toBe('66jcfp');
                expect(response.name).toBe('MAN. UNITED');
                expect(response.picture).toBe(umtEnvs.dft.TEAM.PICTURE);
                expect(response.ageMinFilter).toBe('20');
                expect(response.ageMaxFilter).toBe('40');
                expect(response.genderFilter).toStrictEqual(['M']);
                expect(response.matchFilter).toStrictEqual(['11v11', '5v5']);
                expect(JSON.parse(response.formation)).toStrictEqual(
                    umtEnvs.dft.TEAM.FORMATION
                );
                expect(response.searchingPlayers).toBe(false);
                expect(JSON.parse(response.coords)).toStrictEqual({
                    LON: { N: '-70.573615' },
                    LAT: { N: '-33.399435' },
                });
            }

            done();
        });
    }, 60000);
});
