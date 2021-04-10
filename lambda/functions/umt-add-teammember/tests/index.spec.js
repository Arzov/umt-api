const aws = require('aws-sdk');
const umtEnvs = require('../../../layers/umt-envs/nodejs/node_modules/umt-envs');
const events = require('../events/events.json');

describe('Test AWS Lambda: umt-add-teammember', () => {
    let lambda = new aws.Lambda(umtEnvs.dev.LAMBDA_CONFIG);
    let params = { FunctionName: 'umt-add-teammember' };

    test('Evaluate: Team - Member (MAN. UNITED - franco.barrientos@arzov.com)', (done) => {
        params.Payload = JSON.stringify(events[0]);

        lambda.invoke(params, function (err, data) {
            if (err) {
                console.log(err);
                expect(err.StatusCode).toBe(200);
            } else {
                let response = JSON.parse(data.Payload);

                expect(data.StatusCode).toBe(200);
                expect(response.teamId).toBe('man.united');
                expect(response.email).toBe('franco.barrientos@arzov.com');
                expect(JSON.parse(response.position)).toStrictEqual(
                    umtEnvs.dft.TEAM_MEMBER.POSITION
                );
                expect(response.role).toStrictEqual([
                    'Admin',
                    'Player',
                    'Captain',
                ]);
                expect(JSON.parse(response.reqStat)).toStrictEqual({
                    TR: { S: 'A' },
                    PR: { S: 'A' },
                });
                expect(response.number).toBe('0');
            }

            done();
        });
    }, 60000);

    test('Evaluate: Team - Member (MAN. UNITED - jesus.barrientos@arzov.com)', (done) => {
        params.Payload = JSON.stringify(events[1]);

        lambda.invoke(params, function (err, data) {
            if (err) {
                console.log(err);
                expect(err.StatusCode).toBe(200);
            } else {
                let response = JSON.parse(data.Payload);

                expect(data.StatusCode).toBe(200);
                expect(response.teamId).toBe('man.united');
                expect(response.email).toBe('jesus.barrientos@arzov.com');
                expect(JSON.parse(response.position)).toStrictEqual(
                    umtEnvs.dft.TEAM_MEMBER.POSITION
                );
                expect(response.role).toStrictEqual(['Player']);
                expect(JSON.parse(response.reqStat)).toStrictEqual({
                    TR: { S: 'P' },
                    PR: { S: 'A' },
                });
                expect(response.number).toBe('0');
            }

            done();
        });
    }, 60000);

    test('Evaluate: Team - Member (FC BARCELONA - jesus.barrientos@arzov.com)', (done) => {
        params.Payload = JSON.stringify(events[2]);

        lambda.invoke(params, function (err, data) {
            if (err) {
                console.log(err);
                expect(err.StatusCode).toBe(200);
            } else {
                let response = JSON.parse(data.Payload);

                expect(data.StatusCode).toBe(200);
                expect(response.teamId).toBe('fcbarcelona');
                expect(response.email).toBe('jesus.barrientos@arzov.com');
                expect(JSON.parse(response.position)).toStrictEqual(
                    umtEnvs.dft.TEAM_MEMBER.POSITION
                );
                expect(response.role).toStrictEqual([
                    'Admin',
                    'Player',
                    'Captain',
                ]);
                expect(JSON.parse(response.reqStat)).toStrictEqual({
                    TR: { S: 'A' },
                    PR: { S: 'A' },
                });
                expect(response.number).toBe('0');
            }

            done();
        });
    }, 60000);

    test('Evaluate: Team - Member (FC BARCELONA - franco.barrientos@arzov.com)', (done) => {
        params.Payload = JSON.stringify(events[3]);

        lambda.invoke(params, function (err, data) {
            if (err) {
                console.log(err);
                expect(err.StatusCode).toBe(200);
            } else {
                let response = JSON.parse(data.Payload);

                expect(data.StatusCode).toBe(200);
                expect(response.teamId).toBe('fcbarcelona');
                expect(response.email).toBe('franco.barrientos@arzov.com');
                expect(JSON.parse(response.position)).toStrictEqual(
                    umtEnvs.dft.TEAM_MEMBER.POSITION
                );
                expect(response.role).toStrictEqual(['Player']);
                expect(JSON.parse(response.reqStat)).toStrictEqual({
                    TR: { S: 'A' },
                    PR: { S: 'P' },
                });
                expect(response.number).toBe('0');
            }

            done();
        });
    }, 60000);

    test('Evaluate: Team - Member (BAYERN - matias.barrientos@arzov.com)', (done) => {
        params.Payload = JSON.stringify(events[4]);

        lambda.invoke(params, function (err, data) {
            if (err) {
                console.log(err);
                expect(err.StatusCode).toBe(200);
            } else {
                let response = JSON.parse(data.Payload);

                expect(data.StatusCode).toBe(200);
                expect(response.teamId).toBe('bayern');
                expect(response.email).toBe('matias.barrientos@arzov.com');
                expect(JSON.parse(response.position)).toStrictEqual(
                    umtEnvs.dft.TEAM_MEMBER.POSITION
                );
                expect(response.role).toStrictEqual([
                    'Admin',
                    'Player',
                    'Captain',
                ]);
                expect(JSON.parse(response.reqStat)).toStrictEqual({
                    TR: { S: 'A' },
                    PR: { S: 'A' },
                });
                expect(response.number).toBe('0');
            }

            done();
        });
    }, 60000);

    test('Evaluate: Team - Member (BAYERN - franco.barrientos@arzov.com)', (done) => {
        params.Payload = JSON.stringify(events[5]);

        lambda.invoke(params, function (err, data) {
            if (err) {
                console.log(err);
                expect(err.StatusCode).toBe(200);
            } else {
                let response = JSON.parse(data.Payload);

                expect(data.StatusCode).toBe(200);
                expect(response.teamId).toBe('bayern');
                expect(response.email).toBe('franco.barrientos@arzov.com');
                expect(JSON.parse(response.position)).toStrictEqual(
                    umtEnvs.dft.TEAM_MEMBER.POSITION
                );
                expect(response.role).toStrictEqual(['Player']);
                expect(JSON.parse(response.reqStat)).toStrictEqual({
                    TR: { S: 'P' },
                    PR: { S: 'A' },
                });
                expect(response.number).toBe('0');
            }

            done();
        });
    }, 60000);

    test('Evaluate: Team - Memeber (PSG - nadia.sepulveda@arzov.com)', (done) => {
        params.Payload = JSON.stringify(events[6]);

        lambda.invoke(params, function (err, data) {
            if (err) {
                console.log(err);
                expect(err.StatusCode).toBe(200);
            } else {
                let response = JSON.parse(data.Payload);

                expect(data.StatusCode).toBe(200);
                expect(response.teamId).toBe('psg');
                expect(response.email).toBe('nadia.sepulveda@arzov.com');
                expect(JSON.parse(response.position)).toStrictEqual(
                    umtEnvs.dft.TEAM_MEMBER.POSITION
                );
                expect(response.role).toStrictEqual([
                    'Admin',
                    'Player',
                    'Captain',
                ]);
                expect(JSON.parse(response.reqStat)).toStrictEqual({
                    TR: { S: 'A' },
                    PR: { S: 'A' },
                });
                expect(response.number).toBe('0');
            }

            done();
        });
    }, 60000);

    test('Evaluate: Team - Member (REAL MADRID - ivo.farias@arzov.com)', (done) => {
        params.Payload = JSON.stringify(events[7]);

        lambda.invoke(params, function (err, data) {
            if (err) {
                console.log(err);
                expect(err.StatusCode).toBe(200);
            } else {
                let response = JSON.parse(data.Payload);

                expect(data.StatusCode).toBe(200);
                expect(response.teamId).toBe('realmadrid');
                expect(response.email).toBe('ivo.farias@arzov.com');
                expect(JSON.parse(response.position)).toStrictEqual(
                    umtEnvs.dft.TEAM_MEMBER.POSITION
                );
                expect(response.role).toStrictEqual([
                    'Admin',
                    'Player',
                    'Captain',
                ]);
                expect(JSON.parse(response.reqStat)).toStrictEqual({
                    TR: { S: 'A' },
                    PR: { S: 'A' },
                });
                expect(response.number).toBe('0');
            }

            done();
        });
    }, 60000);

    test('Evaluate: Team - Member (CHELSEA - jesus.barrientos@arzov.com)', (done) => {
        params.Payload = JSON.stringify(events[8]);

        lambda.invoke(params, function (err, data) {
            if (err) {
                console.log(err);
                expect(err.StatusCode).toBe(200);
            } else {
                let response = JSON.parse(data.Payload);

                expect(data.StatusCode).toBe(200);
                expect(response.teamId).toBe('chelsea');
                expect(response.email).toBe('jesus.barrientos@arzov.com');
                expect(JSON.parse(response.position)).toStrictEqual(
                    umtEnvs.dft.TEAM_MEMBER.POSITION
                );
                expect(response.role).toStrictEqual([
                    'Admin',
                    'Player',
                    'Captain',
                ]);
                expect(JSON.parse(response.reqStat)).toStrictEqual({
                    TR: { S: 'A' },
                    PR: { S: 'A' },
                });
                expect(response.number).toBe('0');
            }

            done();
        });
    }, 60000);

    test('Evaluate: Team - Member (BAYERN - nadia.sepulveda@arzov.com)', (done) => {
        params.Payload = JSON.stringify(events[9]);

        lambda.invoke(params, function (err, data) {
            if (err) {
                console.log(err);
                expect(err.StatusCode).toBe(200);
            } else {
                let response = JSON.parse(data.Payload);

                expect(data.StatusCode).toBe(200);
                expect(response.teamId).toBe('bayern');
                expect(response.email).toBe('nadia.sepulveda@arzov.com');
                expect(JSON.parse(response.position)).toStrictEqual(
                    umtEnvs.dft.TEAM_MEMBER.POSITION
                );
                expect(response.role).toStrictEqual(['Player']);
                expect(JSON.parse(response.reqStat)).toStrictEqual({
                    TR: { S: 'A' },
                    PR: { S: 'A' },
                });
                expect(response.number).toBe('0');
            }

            done();
        });
    }, 60000);

    test('Evaluate: Team - Member (AC MILAN - nadia.sepulveda@arzov.com)', (done) => {
        params.Payload = JSON.stringify(events[10]);

        lambda.invoke(params, function (err, data) {
            if (err) {
                console.log(err);
                expect(err.StatusCode).toBe(200);
            } else {
                let response = JSON.parse(data.Payload);

                expect(data.StatusCode).toBe(200);
                expect(response.teamId).toBe('acmilan');
                expect(response.email).toBe('nadia.sepulveda@arzov.com');
                expect(JSON.parse(response.position)).toStrictEqual(
                    umtEnvs.dft.TEAM_MEMBER.POSITION
                );
                expect(response.role).toStrictEqual([
                    'Admin',
                    'Player',
                    'Captain',
                ]);
                expect(JSON.parse(response.reqStat)).toStrictEqual({
                    TR: { S: 'A' },
                    PR: { S: 'A' },
                });
                expect(response.number).toBe('0');
            }

            done();
        });
    }, 60000);
});
