/**
 * Test: umt-update-match
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


// packages

const aws = require('aws-sdk');
const umtEnvs = require('../../../layers/umt-envs/nodejs/node_modules/umt-envs');
const events = require('../events/events.json');


// execution

describe('Test AWS Lambda: umt-update-match', () => {

    let lambda = new aws.Lambda(umtEnvs.dev.LAMBDA_CONFIG);
    let params = { FunctionName: 'umt-update-match' };


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
                    NP: { N: '3' },
                });
                expect(response.positions).toStrictEqual(['GK']);
                expect(response.matchFilter).toStrictEqual(['5v5', '11v11']);
                expect(response.ageMinFilter).toBe('20');
                expect(response.ageMaxFilter).toBe('40');
                expect(JSON.parse(response.reqStat)).toStrictEqual({
                    AR: { S: 'A' },
                    RR: { S: 'A' },
                });
                expect(response.stadiumGeohash).toBe('');
                expect(response.stadiumId).toBe('');
                expect(response.courtId).toBe('0');
                expect(response.genderFilter).toStrictEqual(['M']);
                expect(response.geohash).toBe('66jcfp');
                expect(JSON.parse(response.coords)).toStrictEqual({
                    LON: { N: '-70.573615' },
                    LAT: { N: '-33.399435' },
                });
                expect(response.schedule).toBe('9999-04-04T20:36:57.562Z');
            }

            done();
        });
    }, 60000);


    // test 2

    test('Evaluate: Match (PSG - REAL MADRID)', (done) => {

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
                    code: 'MatchNotExistException',
                    message: `El partido no existe.`,
                });
            }

            done();
        });
    }, 60000);


    // test 3

    test('Evaluate: Match (CHELSEA - REAL MADRID)', (done) => {

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
                expect(response.teamId1).toBe('chelsea');
                expect(response.teamId2).toBe('realmadrid');
            }

            done();
        });
    }, 60000);


    // test 4

    test('Evaluate: Match (AC MILAN - BAYERN)', (done) => {

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
                expect(response.teamId1).toBe('acmilan');
                expect(response.teamId2).toBe('bayern');
                expect(JSON.parse(response.patches)).toStrictEqual({
                    CP: { N: '0' },
                    NP: { N: '2' },
                });
                expect(response.ageMinFilter).toBe('20');
                expect(response.ageMaxFilter).toBe('40');
                expect(JSON.parse(response.reqStat)).toStrictEqual({
                    AR: { S: 'A' },
                    RR: { S: 'A' },
                });
                expect(response.schedule).toBe('2021-04-04T20:36:57.562Z');
            }

            done();
        });
    }, 60000);


    // test 5

    test('Evaluate: Match (FC BARCELONA - MAN. UNITED)', (done) => {

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
                expect(response.teamId1).toBe('fcbarcelona');
                expect(response.teamId2).toBe('man.united');
                expect(JSON.parse(response.patches)).toStrictEqual({
                    CP: { N: '0' },
                    NP: { N: '0' },
                });
                expect(response.ageMinFilter).toBe('20');
                expect(response.ageMaxFilter).toBe('40');
                expect(JSON.parse(response.reqStat)).toStrictEqual({
                    AR: { S: 'A' },
                    RR: { S: 'A' },
                });
            }

            done();
        });
    }, 60000);
});
