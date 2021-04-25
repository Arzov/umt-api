/**
 * Test: umt-add-team
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


// packages

const aws = require('aws-sdk');
const umtEnvs = require('../../../layers/umt-envs/nodejs/node_modules/umt-envs');
const events = require('../events/events.json');


// execution

describe('Test AWS Lambda: umt-add-team', () => {

    let lambda = new aws.Lambda(umtEnvs.dev.LAMBDA_CONFIG);
    let params = { FunctionName: 'umt-add-team' };


    // test 1

    test('Evaluate: Team (REAL MADRID)', (done) => {

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
                expect(response.geohash).toBe('66jcfp');
                expect(response.id).toBe('realmadrid');
                expect(response.name).toBe('REAL MADRID');
                expect(response.picture).toBe('');
                expect(response.ageMinFilter).toBe('20');
                expect(response.ageMaxFilter).toBe('40');
                expect(response.genderFilter).toStrictEqual(['M']);
                expect(response.matchFilter).toStrictEqual([
                    '5v5',
                    '7v7',
                    '11v11',
                ]);
                expect(JSON.parse(response.formation)).toStrictEqual(
                    umtEnvs.dft.TEAM.FORMATION
                );
                expect(JSON.parse(response.coords)).toStrictEqual({
                    LON: { N: '-70.573615' },
                    LAT: { N: '-33.399435' },
                });
            }

            done();
        });
    }, 60000);


    // test 2

    test('Evaluate: Team (MAN. UNITED)', (done) => {

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
                expect(response.geohash).toBe('66jcfp');
                expect(response.id).toBe('man.united');
                expect(response.name).toBe('MAN. UNITED');
                expect(response.picture).toBe('');
                expect(response.ageMinFilter).toBe('20');
                expect(response.ageMaxFilter).toBe('40');
                expect(response.genderFilter).toStrictEqual(['M']);
                expect(response.matchFilter).toStrictEqual(['5v5', '11v11']);
                expect(JSON.parse(response.formation)).toStrictEqual(
                    umtEnvs.dft.TEAM.FORMATION
                );
                expect(JSON.parse(response.coords)).toStrictEqual({
                    LON: { N: '-70.573615' },
                    LAT: { N: '-33.399435' },
                });
            }

            done();
        });
    }, 60000);


    // test 3

    test('Evaluate: Team (FC BARCELONA)', (done) => {

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
                expect(response.geohash).toBe('66jcfp');
                expect(response.id).toBe('fcbarcelona');
                expect(response.name).toBe('FC BARCELONA');
                expect(response.picture).toBe('');
                expect(response.ageMinFilter).toBe('20');
                expect(response.ageMaxFilter).toBe('40');
                expect(response.genderFilter).toStrictEqual(['M']);
                expect(response.matchFilter).toStrictEqual(['5v5']);
                expect(JSON.parse(response.formation)).toStrictEqual(
                    umtEnvs.dft.TEAM.FORMATION
                );
                expect(JSON.parse(response.coords)).toStrictEqual({
                    LON: { N: '-70.573615' },
                    LAT: { N: '-33.399435' },
                });
            }

            done();
        });
    }, 60000);


    // test 4

    test('Evaluate: Team (PSG)', (done) => {

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
                expect(response.geohash).toBe('66jcfp');
                expect(response.id).toBe('psg');
                expect(response.name).toBe('PSG');
                expect(response.picture).toBe('');
                expect(response.ageMinFilter).toBe('20');
                expect(response.ageMaxFilter).toBe('40');
                expect(response.genderFilter).toStrictEqual(['F']);
                expect(response.matchFilter).toStrictEqual(['7v7']);
                expect(JSON.parse(response.formation)).toStrictEqual(
                    umtEnvs.dft.TEAM.FORMATION
                );
                expect(JSON.parse(response.coords)).toStrictEqual({
                    LON: { N: '-70.573615' },
                    LAT: { N: '-33.399435' },
                });
            }

            done();
        });
    }, 60000);


    // test 5

    test('Evaluate: Team (BAYERN)', (done) => {

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
                expect(response.geohash).toBe('66jcfp');
                expect(response.id).toBe('bayern');
                expect(response.name).toBe('BAYERN');
                expect(response.picture).toBe('');
                expect(response.ageMinFilter).toBe('20');
                expect(response.ageMaxFilter).toBe('40');
                expect(response.genderFilter).toStrictEqual(['M', 'F']);
                expect(response.matchFilter).toStrictEqual(['7v7']);
                expect(JSON.parse(response.formation)).toStrictEqual(
                    umtEnvs.dft.TEAM.FORMATION
                );
                expect(JSON.parse(response.coords)).toStrictEqual({
                    LON: { N: '-70.573615' },
                    LAT: { N: '-33.399435' },
                });
            }

            done();
        });
    }, 60000);


    // test 6

    test('Evaluate: Team (CHELSEA)', (done) => {

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
                expect(response.geohash).toBe('66jcfp');
                expect(response.id).toBe('chelsea');
                expect(response.name).toBe('CHELSEA');
                expect(response.picture).toBe('');
                expect(response.ageMinFilter).toBe('20');
                expect(response.ageMaxFilter).toBe('40');
                expect(response.genderFilter).toStrictEqual(['M']);
                expect(response.matchFilter).toStrictEqual(['7v7']);
                expect(JSON.parse(response.formation)).toStrictEqual(
                    umtEnvs.dft.TEAM.FORMATION
                );
                expect(JSON.parse(response.coords)).toStrictEqual({
                    LON: { N: '-70.573615' },
                    LAT: { N: '-33.399435' },
                });
            }

            done();
        });
    }, 60000);


    // test 7

    test('Evaluate: Existing team (CHELSEA)', (done) => {

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
                expect(JSON.parse(response.errorMessage)).toStrictEqual({
                    code: 'TeamExistException',
                    message: 'El equipo ya existe.',
                });
            }

            done();
        });
    }, 60000);


    // test 8

    test('Evaluate: Team (AC MILAN)', (done) => {

        params.Payload = JSON.stringify(events[6]);

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
                expect(response.geohash).toBe('66jcfp');
                expect(response.id).toBe('acmilan');
                expect(response.name).toBe('AC MILAN');
                expect(response.picture).toBe('');
                expect(response.ageMinFilter).toBe('20');
                expect(response.ageMaxFilter).toBe('40');
                expect(response.genderFilter).toStrictEqual(['M', 'F']);
                expect(response.matchFilter).toStrictEqual([
                    '5v5',
                    '7v7',
                    '11v11',
                ]);
                expect(JSON.parse(response.formation)).toStrictEqual(
                    umtEnvs.dft.TEAM.FORMATION
                );
                expect(JSON.parse(response.coords)).toStrictEqual({
                    LON: { N: '-70.573615' },
                    LAT: { N: '-33.399435' },
                });
            }

            done();
        });
    }, 60000);
});
