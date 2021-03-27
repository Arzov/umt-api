const aws = require('aws-sdk');
const umtEnvs = require('../../../layers/umt-envs/nodejs/node_modules/umt-envs');
const events = require('../events/events.json');

describe('Test AWS Lambda: umt-add-match', () => {
    let lambda = new aws.Lambda(umtEnvs.dev.LAMBDA_CONFIG);
    let params = { FunctionName: 'umt-add-match' };

    test('Evaluate: Match (MAN. UNITED - REAL MADRID)', (done) => {
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
                expect(response.allowedPatches).toBe('1');
                expect(response.positions).toStrictEqual(['']);
                expect(response.ageMinFilter).toBe('20');
                expect(response.ageMaxFilter).toBe('40');
                expect(response.matchFilter).toStrictEqual(['5v5', '11v11']);
                expect(JSON.parse(response.reqStat)).toStrictEqual({
                    AR: { S: 'A' },
                    RR: { S: 'P' },
                });
                expect(response.geohash).toBe('66jcfp');
                expect(response.stadiumGeohash).toBe('');
                expect(response.stadiumId).toBe('');
                expect(response.courtId).toBe('0');
                expect(response.genderFilter).toStrictEqual(['M']);
                expect(JSON.parse(response.coords)).toStrictEqual({
                    LON: { N: '-70.573615' },
                    LAT: { N: '-33.399435' },
                });
            }

            done();
        });
    }, 60000);

    test('Evaluate: Match (REAL MADRID - MAN. UNITED)', (done) => {
        params.Payload = JSON.stringify(events[1]);

        lambda.invoke(params, function (err, data) {
            if (err) {
                console.log(err);
                expect(err.StatusCode).toBe(200);
            } else {
                let response = JSON.parse(data.Payload);

                expect(data.StatusCode).toBe(200);
                expect(JSON.parse(response.errorMessage)).toStrictEqual({
                    code: 'MatchExistsException',
                    message: `Ya existe una solicitud desde el equipo rival.`,
                });
            }

            done();
        });
    }, 60000);

    test('Evaluate: Match (FC BARCELONA - MAN. UNITED)', (done) => {
        params.Payload = JSON.stringify(events[2]);

        lambda.invoke(params, function (err, data) {
            if (err) {
                console.log(err);
                expect(err.StatusCode).toBe(200);
            } else {
                let response = JSON.parse(data.Payload);

                expect(data.StatusCode).toBe(200);
                expect(response.teamId1).toBe('fcbarcelona');
                expect(response.teamId2).toBe('man.united');
                expect(response.allowedPatches).toBe('0');
                expect(response.positions).toStrictEqual(['']);
                expect(response.ageMinFilter).toBe('20');
                expect(response.ageMaxFilter).toBe('40');
                expect(response.matchFilter).toStrictEqual(['5v5']);
                expect(JSON.parse(response.reqStat)).toStrictEqual({
                    AR: { S: 'A' },
                    RR: { S: 'P' },
                });
                expect(response.geohash).toBe('66jcfp');
                expect(response.stadiumGeohash).toBe('');
                expect(response.stadiumId).toBe('');
                expect(response.courtId).toBe('0');
                expect(response.genderFilter).toStrictEqual(['M']);
                expect(JSON.parse(response.coords)).toStrictEqual({
                    LON: { N: '-70.573615' },
                    LAT: { N: '-33.399435' },
                });
            }

            done();
        });
    }, 60000);

    test('Evaluate: Match (CHELSEA - REAL MADRID)', (done) => {
        params.Payload = JSON.stringify(events[3]);

        lambda.invoke(params, function (err, data) {
            if (err) {
                console.log(err);
                expect(err.StatusCode).toBe(200);
            } else {
                let response = JSON.parse(data.Payload);

                expect(data.StatusCode).toBe(200);
                expect(response.teamId1).toBe('chelsea');
                expect(response.teamId2).toBe('realmadrid');
                expect(response.allowedPatches).toBe('0');
                expect(response.positions).toStrictEqual(['']);
                expect(response.ageMinFilter).toBe('20');
                expect(response.ageMaxFilter).toBe('40');
                expect(response.matchFilter).toStrictEqual(['7v7']);
                expect(JSON.parse(response.reqStat)).toStrictEqual({
                    AR: { S: 'A' },
                    RR: { S: 'P' },
                });
                expect(response.geohash).toBe('66jcfp');
                expect(response.stadiumGeohash).toBe('');
                expect(response.stadiumId).toBe('');
                expect(response.courtId).toBe('0');
                expect(response.genderFilter).toStrictEqual(['M']);
                expect(JSON.parse(response.coords)).toStrictEqual({
                    LON: { N: '-70.573615' },
                    LAT: { N: '-33.399435' },
                });
            }

            done();
        });
    }, 60000);
});
