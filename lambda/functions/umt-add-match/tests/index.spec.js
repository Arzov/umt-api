/**
 * Test: umt-add-match
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


// packages

const aws = require('aws-sdk');
const umtEnvs = require('../../../layers/umt-envs/nodejs/node_modules/umt-envs');
const events = require('../events/events.json');


// execution

describe('Test AWS Lambda: umt-add-match', () => {

    let lambda = new aws.Lambda(umtEnvs.dev.LAMBDA_CONFIG);
    let params = { FunctionName: 'umt-add-match' };


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
                expect(response.teamId1).toBe('man.united');
                expect(response.teamId2).toBe('realmadrid');
                expect(JSON.parse(response.patches)).toStrictEqual({
                    CP: { N: '0' },
                    NP: { N: '0' },
                });
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


    // test 2

    test('Evaluate: Match (REAL MADRID - MAN. UNITED)', (done) => {

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
                expect(JSON.parse(response.errorMessage)).toStrictEqual({
                    code    : 'MatchExistException',
                    message : `Ya existe una solicitud desde el equipo rival.`,
                });
            }

            done();
        });
    }, 60000);


    // test 3

    test('Evaluate: Match (FC BARCELONA - MAN. UNITED)', (done) => {

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
                expect(response.teamId1).toBe('fcbarcelona');
                expect(response.teamId2).toBe('man.united');
                expect(JSON.parse(response.patches)).toStrictEqual({
                    CP: { N: '0' },
                    NP: { N: '0' },
                });
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


    // test 4

    test('Evaluate: Match (CHELSEA - REAL MADRID)', (done) => {

        params.Payload = JSON.stringify(events[3]);

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
                expect(response.teamId1).toBe('chelsea');
                expect(response.teamId2).toBe('realmadrid');
                expect(JSON.parse(response.patches)).toStrictEqual({
                    CP: { N: '0' },
                    NP: { N: '0' },
                });
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


    // test 5

    test('Evaluate: Match (AC MILAN - BAYERN)', (done) => {

        params.Payload = JSON.stringify(events[4]);

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
                expect(response.teamId1).toBe('acmilan');
                expect(response.teamId2).toBe('bayern');
                expect(JSON.parse(response.patches)).toStrictEqual({
                    CP: { N: '0' },
                    NP: { N: '0' },
                });
                expect(response.positions).toStrictEqual(['']);
                expect(response.ageMinFilter).toBe('20');
                expect(response.ageMaxFilter).toBe('40');
                expect(response.matchFilter).toStrictEqual([
                    '5v5',
                    '7v7',
                    '11v11',
                ]);
                expect(JSON.parse(response.reqStat)).toStrictEqual({
                    AR: { S: 'A' },
                    RR: { S: 'P' },
                });
                expect(response.geohash).toBe('66jcfp');
                expect(response.stadiumGeohash).toBe('');
                expect(response.stadiumId).toBe('');
                expect(response.courtId).toBe('0');
                expect(response.genderFilter).toStrictEqual(['M', 'F']);
                expect(JSON.parse(response.coords)).toStrictEqual({
                    LON: { N: '-70.573615' },
                    LAT: { N: '-33.399435' },
                });
            }

            done();
        });
    }, 60000);


    // test 6

    test('Evaluate: Match (REAL MADRID - FC BARCELONA)', (done) => {

        params.Payload = JSON.stringify(events[5]);

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
                expect(JSON.parse(response.patches)).toStrictEqual({
                    CP: { N: '0' },
                    NP: { N: '0' },
                });
                expect(response.positions).toStrictEqual(['']);
                expect(response.ageMinFilter).toBe('20');
                expect(response.ageMaxFilter).toBe('40');
                expect(response.matchFilter).toStrictEqual([
                    '5v5',
                    '7v7',
                    '11v11',
                ]);
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
