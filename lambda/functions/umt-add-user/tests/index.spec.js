const aws = require('aws-sdk');
const umtEnvs = require('../../../layers/umt-envs/nodejs/node_modules/umt-envs');
const events = require('../events/events.json');

describe('Test AWS Lambda: umt-add-user', () => {
    let lambda = new aws.Lambda(umtEnvs.dev.LAMBDA_CONFIG);
    let params = { FunctionName: 'umt-add-user' };

    test('Evaluate: User (franco.barrientos@arzov.com)', (done) => {
        params.Payload = JSON.stringify(events[0]);

        lambda.invoke(params, function (err, data) {
            if (err) {
                console.log(err);
                expect(err.StatusCode).toBe(200);
            } else {
                let response = JSON.parse(data.Payload);

                expect(data.StatusCode).toBe(200);
                expect(response.email).toBe('franco.barrientos@arzov.com');
                expect(response.geohash).toBe('66jcfp');
                expect(JSON.parse(response.coords).LON.N).toBe('-70.573615');
                expect(JSON.parse(response.coords).LAT.N).toBe('-33.399435');
                expect(response.ageMinFilter).toBe('20');
                expect(response.ageMaxFilter).toBe('40');
                expect(response.matchFilter).toStrictEqual([
                    '5v5',
                    '7v7',
                    '11v11',
                ]);
                expect(response.positions).toStrictEqual(['CF', 'LW', 'RW']);
                expect(JSON.parse(response.skills)).toStrictEqual(
                    umtEnvs.dft.USER.SKILLS
                );
                expect(response.foot).toBe('R');
                expect(response.weight).toBe('75');
                expect(response.height).toBe('175');
            }

            done();
        });
    }, 60000);

    test('Evaluate: User (jesus.barrientos@arzov.com)', (done) => {
        params.Payload = JSON.stringify(events[1]);

        lambda.invoke(params, function (err, data) {
            if (err) {
                console.log(err);
                expect(err.StatusCode).toBe(200);
            } else {
                let response = JSON.parse(data.Payload);

                expect(data.StatusCode).toBe(200);
                expect(response.email).toBe('jesus.barrientos@arzov.com');
                expect(response.geohash).toBe('66jcfp');
                expect(JSON.parse(response.coords).LON.N).toBe('-70.573615');
                expect(JSON.parse(response.coords).LAT.N).toBe('-33.399435');
                expect(response.ageMinFilter).toBe('20');
                expect(response.ageMaxFilter).toBe('40');
                expect(response.matchFilter).toStrictEqual(['5v5', '7v7']);
                expect(response.positions).toStrictEqual(['']);
                expect(JSON.parse(response.skills)).toStrictEqual(
                    umtEnvs.dft.USER.SKILLS
                );
                expect(response.foot).toBe('R');
                expect(response.weight).toBe('80');
                expect(response.height).toBe('170');
            }

            done();
        });
    }, 60000);

    test('Evaluate: User (matias.barrientos@arzov.com)', (done) => {
        params.Payload = JSON.stringify(events[2]);

        lambda.invoke(params, function (err, data) {
            if (err) {
                console.log(err);
                expect(err.StatusCode).toBe(200);
            } else {
                let response = JSON.parse(data.Payload);

                expect(data.StatusCode).toBe(200);
                expect(response.email).toBe('matias.barrientos@arzov.com');
                expect(response.geohash).toBe('66jcfp');
                expect(JSON.parse(response.coords).LON.N).toBe('-70.573615');
                expect(JSON.parse(response.coords).LAT.N).toBe('-33.399435');
                expect(response.ageMinFilter).toBe('20');
                expect(response.ageMaxFilter).toBe('35');
                expect(response.matchFilter).toStrictEqual(['7v7']);
                expect(response.positions).toStrictEqual(['GK', 'LW', 'RW']);
                expect(JSON.parse(response.skills)).toStrictEqual(
                    umtEnvs.dft.USER.SKILLS
                );
                expect(response.foot).toBe('R');
                expect(response.weight).toBe('65');
                expect(response.height).toBe('175');
            }

            done();
        });
    }, 60000);

    test('Evaluate: User (svonko.vescovi@arzov.com)', (done) => {
        params.Payload = JSON.stringify(events[3]);

        lambda.invoke(params, function (err, data) {
            if (err) {
                console.log(err);
                expect(err.StatusCode).toBe(200);
            } else {
                let response = JSON.parse(data.Payload);

                expect(data.StatusCode).toBe(200);
                expect(response.email).toBe('svonko.vescovi@arzov.com');
                expect(response.geohash).toBe('66jcfp');
                expect(JSON.parse(response.coords).LON.N).toBe('-70.573615');
                expect(JSON.parse(response.coords).LAT.N).toBe('-33.399435');
                expect(response.ageMinFilter).toBe('20');
                expect(response.ageMaxFilter).toBe('35');
                expect(response.matchFilter).toStrictEqual(['7v7']);
                expect(response.positions).toStrictEqual(['CF', 'LW', 'RW']);
                expect(JSON.parse(response.skills)).toStrictEqual(
                    umtEnvs.dft.USER.SKILLS
                );
                expect(response.foot).toBe('R');
                expect(response.weight).toBe('80');
                expect(response.height).toBe('170');
            }

            done();
        });
    }, 60000);

    test('Evaluate: User (diego.lagos@arzov.com)', (done) => {
        params.Payload = JSON.stringify(events[4]);

        lambda.invoke(params, function (err, data) {
            if (err) {
                console.log(err);
                expect(err.StatusCode).toBe(200);
            } else {
                let response = JSON.parse(data.Payload);

                expect(data.StatusCode).toBe(200);
                expect(response.email).toBe('diego.lagos@arzov.com');
                expect(response.geohash).toBe('66jcfp');
                expect(JSON.parse(response.coords).LON.N).toBe('-70.573615');
                expect(JSON.parse(response.coords).LAT.N).toBe('-33.399435');
                expect(response.ageMinFilter).toBe('20');
                expect(response.ageMaxFilter).toBe('40');
                expect(response.matchFilter).toStrictEqual(['5v5', '7v7']);
                expect(response.positions).toStrictEqual(['']);
                expect(JSON.parse(response.skills)).toStrictEqual(
                    umtEnvs.dft.USER.SKILLS
                );
                expect(response.foot).toBe('R');
                expect(response.weight).toBe('75');
                expect(response.height).toBe('180');
            }

            done();
        });
    }, 60000);

    test('Evaluate: User (ivo.farias@arzov.com)', (done) => {
        params.Payload = JSON.stringify(events[5]);

        lambda.invoke(params, function (err, data) {
            if (err) {
                console.log(err);
                expect(err.StatusCode).toBe(200);
            } else {
                let response = JSON.parse(data.Payload);

                expect(data.StatusCode).toBe(200);
                expect(response.email).toBe('ivo.farias@arzov.com');
                expect(response.geohash).toBe('66jcfp');
                expect(JSON.parse(response.coords).LON.N).toBe('-70.573615');
                expect(JSON.parse(response.coords).LAT.N).toBe('-33.399435');
                expect(response.ageMinFilter).toBe('20');
                expect(response.ageMaxFilter).toBe('40');
                expect(response.matchFilter).toStrictEqual(['5v5', '7v7']);
                expect(response.positions).toStrictEqual(['']);
                expect(JSON.parse(response.skills)).toStrictEqual(
                    umtEnvs.dft.USER.SKILLS
                );
                expect(response.foot).toBe('L');
                expect(response.weight).toBe('83');
                expect(response.height).toBe('172');
            }

            done();
        });
    }, 60000);

    test('Evaluate: User (nadia.sepulveda@arzov.com)', (done) => {
        params.Payload = JSON.stringify(events[6]);

        lambda.invoke(params, function (err, data) {
            if (err) {
                console.log(err);
                expect(err.StatusCode).toBe(200);
            } else {
                let response = JSON.parse(data.Payload);

                expect(data.StatusCode).toBe(200);
                expect(response.email).toBe('nadia.sepulveda@arzov.com');
                expect(response.geohash).toBe('66jcfp');
                expect(JSON.parse(response.coords).LON.N).toBe('-70.573615');
                expect(JSON.parse(response.coords).LAT.N).toBe('-33.399435');
                expect(response.ageMinFilter).toBe('20');
                expect(response.ageMaxFilter).toBe('40');
                expect(response.matchFilter).toStrictEqual(['5v5', '7v7']);
                expect(response.positions).toStrictEqual(['']);
                expect(JSON.parse(response.skills)).toStrictEqual(
                    umtEnvs.dft.USER.SKILLS
                );
                expect(response.foot).toBe('L');
                expect(response.weight).toBe('60');
                expect(response.height).toBe('161');
            }

            done();
        });
    }, 60000);
});
