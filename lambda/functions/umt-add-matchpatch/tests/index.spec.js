/**
 * Test: umt-add-matchpatch
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


// packages

const aws = require('aws-sdk');
const umtEnvs = require('../../../layers/umt-envs/nodejs/node_modules/umt-envs');
const events = require('../events/events.json');


// execution

describe('Test AWS Lambda: umt-add-matchpatch', () => {

    let lambda = new aws.Lambda(umtEnvs.dev.LAMBDA_CONFIG);
    let params = { FunctionName: 'umt-add-matchpatch' };


    // test 1

    test('Evaluate: Patch - Match (svonko.vescovi@arzov.com, MAN. UNITED - REAL MADRID)', (done) => {

        params.Payload = JSON.stringify(events[0]);

        lambda.invoke(params, function (err, data) {

            // error

            if (err) {
                console.log(err);
                expect(err.StatusCode).toBe(200);
            }

            // success

            else {
                const response = JSON.parse(data.Payload);

                expect(data.StatusCode).toBe(200);
                expect(response.teamId1).toBe('man.united');
                expect(response.teamId2).toBe('realmadrid');
                expect(response.email).toBe('svonko.vescovi@arzov.com');
                expect(response.name).toBe('Svonko');
                expect(JSON.parse(response.reqStat)).toStrictEqual({
                    MR: { S: 'A' },
                    PR: { S: 'A' },
                });
                expect(response.expireOn).toBe('2021-04-04T20:36:57.562Z');
            }

            done();
        });
    }, 60000);


    // test 2

    test('Evaluate: Match - Patch (MAN. UNITED - REAL MADRID, svonko.vescovi@arzov.com)', (done) => {

        params.Payload = JSON.stringify(events[1]);

        lambda.invoke(params, function (err, data) {

            // error

            if (err) {
                console.log(err);
                expect(err.StatusCode).toBe(200);
            }

            // success

            else {
                const response = JSON.parse(data.Payload);

                expect(data.StatusCode).toBe(200);
                expect(JSON.parse(response.errorMessage)).toStrictEqual({
                    code    : 'MatchPatchExistException',
                    message : `El jugador ya participa del partido.`,
                });
            }

            done();
        });
    }, 60000);


    // test 3

    test('Evaluate: Match - Patch (FC BARCELONA - MAN. UNITED, svonko.vescovi@arzov.com)', (done) => {

        params.Payload = JSON.stringify(events[2]);

        lambda.invoke(params, function (err, data) {

            // error

            if (err) {
                console.log(err);
                expect(err.StatusCode).toBe(200);
            }

            // success

            else {
                const response = JSON.parse(data.Payload);

                expect(data.StatusCode).toBe(200);
                expect(response.teamId1).toBe('fcbarcelona');
                expect(response.teamId2).toBe('man.united');
                expect(response.email).toBe('svonko.vescovi@arzov.com');
                expect(response.name).toBe('Svonko');
                expect(JSON.parse(response.reqStat)).toStrictEqual({
                    MR: { S: 'A' },
                    PR: { S: 'P' },
                });
                expect(response.expireOn).toBe('2021-04-04T20:36:57.562Z');
            }

            done();
        });
    }, 60000);


    // test 3

    test('Evaluate: Match - Patch (FC BARCELONA - MAN. UNITED, svonko.vescovi@arzov.com)', (done) => {

        params.Payload = JSON.stringify(events[2]);

        lambda.invoke(params, function (err, data) {

            // error

            if (err) {
                console.log(err);
                expect(err.StatusCode).toBe(200);
            }

            // success

            else {
                const response = JSON.parse(data.Payload);

                expect(data.StatusCode).toBe(200);
                expect(JSON.parse(response.errorMessage)).toStrictEqual({
                    code    : 'MatchPatchRequestException',
                    message : `Ya existe una solicitud para el jugador.`,
                });
            }

            done();
        });
    }, 60000);


    // test 4

    test('Evaluate: Patch - Match (svonko.vescovi@arzov.com, FC BARCELONA - MAN. UNITED)', (done) => {

        params.Payload = JSON.stringify(events[3]);

        lambda.invoke(params, function (err, data) {

            // error

            if (err) {
                console.log(err);
                expect(err.StatusCode).toBe(200);
            }

            // success

            else {
                const response = JSON.parse(data.Payload);

                expect(data.StatusCode).toBe(200);
                expect(response.teamId1).toBe('fcbarcelona');
                expect(response.teamId2).toBe('man.united');
                expect(response.email).toBe('svonko.vescovi@arzov.com');
                expect(response.name).toBe('Svonko');
                expect(JSON.parse(response.reqStat)).toStrictEqual({
                    MR: { S: 'A' },
                    PR: { S: 'A' },
                });
                expect(response.expireOn).toBe('2021-04-04T20:36:57.562Z');
            }

            done();
        });
    }, 60000);


    // test 5

    test('Evaluate: Patch - Match (svonko.vescovi@arzov.com, FC BARCELONA - MAN. UNITED)', (done) => {

        params.Payload = JSON.stringify(events[3]);

        lambda.invoke(params, function (err, data) {

            // error

            if (err) {
                console.log(err);
                expect(err.StatusCode).toBe(200);
            }

            // success

            else {
                const response = JSON.parse(data.Payload);

                expect(data.StatusCode).toBe(200);
                expect(JSON.parse(response.errorMessage)).toStrictEqual({
                    code    : 'MatchPatchExistException',
                    message : `El jugador ya participa del partido.`,
                });
            }

            done();
        });
    }, 60000);


    // test 6

    test('Evaluate: Patch - Match (ivo.farias@arzov.com, FC BARCELONA - MAN. UNITED)', (done) => {

        params.Payload = JSON.stringify(events[4]);

        lambda.invoke(params, function (err, data) {

            // error

            if (err) {
                console.log(err);
                expect(err.StatusCode).toBe(200);
            }

            // success

            else {
                const response = JSON.parse(data.Payload);

                expect(data.StatusCode).toBe(200);
                expect(JSON.parse(response.errorMessage)).toStrictEqual({
                    code    : 'MatchPatchFullException',
                    message : `No quedan cupos en el partido.`,
                });
            }

            done();
        });
    }, 60000);


    // test 7

    test('Evaluate: Patch - Match (ivo.farias@arzov.com, AC MILAN - BAYERN)', (done) => {

        params.Payload = JSON.stringify(events[5]);

        lambda.invoke(params, function (err, data) {

            // error

            if (err) {
                console.log(err);
                expect(err.StatusCode).toBe(200);
            }

            // success

            else {
                const response = JSON.parse(data.Payload);

                expect(data.StatusCode).toBe(200);
                expect(response.teamId1).toBe('acmilan');
                expect(response.teamId2).toBe('bayern');
                expect(response.email).toBe('ivo.farias@arzov.com');
                expect(response.name).toBe('Ivo');
                expect(JSON.parse(response.reqStat)).toStrictEqual({
                    MR: { S: 'A' },
                    PR: { S: 'A' },
                });
                expect(response.expireOn).toBe('2021-04-04T20:36:57.562Z');
            }

            done();
        });
    }, 60000);


    // test 8 

    test('Evaluate: Patch - Match (svonko.vescovi@arzov.com, REAL MADRID - FC BARCELONA)', (done) => {

        params.Payload = JSON.stringify(events[6]);

        lambda.invoke(params, function (err, data) {

            // error

            if (err) {
                console.log(err);
                expect(err.StatusCode).toBe(200);
            }

            // success

            else {
                const response = JSON.parse(data.Payload);

                expect(data.StatusCode).toBe(200);
                expect(response.teamId1).toBe('realmadrid');
                expect(response.teamId2).toBe('fcbarcelona');
                expect(response.email).toBe('svonko.vescovi@arzov.com');
                expect(response.name).toBe('Svonko');
                expect(JSON.parse(response.reqStat)).toStrictEqual({
                    MR: { S: 'A' },
                    PR: { S: 'P' },
                });
                expect(response.expireOn).toBe('2021-04-04T20:36:57.562Z');
            }

            done();
        });
    }, 60000);


    // test 9

    test('Evaluate: Patch - Match (ivo.farias@arzov.com, REAL MADRID - FC BARCELONA)', (done) => {

        params.Payload = JSON.stringify(events[7]);

        lambda.invoke(params, function (err, data) {

            // error

            if (err) {
                console.log(err);
                expect(err.StatusCode).toBe(200);
            }

            // success

            else {
                const response = JSON.parse(data.Payload);

                expect(data.StatusCode).toBe(200);
                expect(JSON.parse(response.errorMessage)).toStrictEqual({
                    code    : 'MatchPatchFullException',
                    message : `No quedan cupos en el partido.`,
                });
            }

            done();
        });
    }, 60000);
});
