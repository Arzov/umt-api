const aws = require('aws-sdk');
const umtEnvs = require('../../../layers/umt-envs/nodejs/node_modules/umt-envs');
const events = require('../events/events.json');

describe('Test AWS Lambda: umt-near-teams', () => {
    let lambda = new aws.Lambda(umtEnvs.dev.LAMBDA_CONFIG);
    let params = { FunctionName: 'umt-near-teams' };

    test('Evaluate: Search teams 01', (done) => {
        params.Payload = JSON.stringify(events[0]);

        lambda.invoke(params, function (err, data) {
            if (err) {
                console.log(err);
                expect(err.StatusCode).toBe(400);
            } else {
                let response = JSON.parse(data.Payload);

                expect(data.StatusCode).toBe(200);
                expect(response.items[0].id).toBe('chelsea');
                expect(response.nextToken).toStrictEqual(
                    '{"rangeKey":{"S":"MTCH#man.united"},"hashKey":{"S":"TM#fcbarcelona"},"geohash":{"S":"66jcfp"}}'
                );
            }

            done();
        });
    }, 60000);

    test('Evaluate: Join team 02', (done) => {
        params.Payload = JSON.stringify(events[1]);

        lambda.invoke(params, function (err, data) {
            if (err) {
                console.log(err);
                expect(err.StatusCode).toBe(400);
            } else {
                let response = JSON.parse(data.Payload);

                expect(data.StatusCode).toBe(200);
                expect(response.items[0].id).toBe('acmilan');
                expect(response.items[1].id).toBe('bayern');
                expect(response.nextToken).toStrictEqual(
                    '{"rangeKey":{"S":"MTCH#man.united"},"hashKey":{"S":"TM#fcbarcelona"},"geohash":{"S":"66jcfp"}}'
                );
            }

            done();
        });
    }, 60000);

    test('Evaluate: Join team 03', (done) => {
        params.Payload = JSON.stringify(events[2]);

        lambda.invoke(params, function (err, data) {
            if (err) {
                console.log(err);
                expect(err.StatusCode).toBe(400);
            } else {
                let response = JSON.parse(data.Payload);

                expect(data.StatusCode).toBe(200);
                expect(response.items).toStrictEqual([]);
                expect(response.nextToken).toStrictEqual(
                    '{"rangeKey":{"S":"MTCH#man.united"},"hashKey":{"S":"TM#fcbarcelona"},"geohash":{"S":"66jcfp"}}'
                );
            }

            done();
        });
    }, 60000);

    test('Evaluate: Search teams 04', (done) => {
        params.Payload = JSON.stringify(events[3]);

        lambda.invoke(params, function (err, data) {
            if (err) {
                console.log(err);
                expect(err.StatusCode).toBe(400);
            } else {
                let response = JSON.parse(data.Payload);

                expect(data.StatusCode).toBe(200);
                expect(response.items).toStrictEqual([]);
                expect(response.nextToken).toStrictEqual(
                    '{"rangeKey":{"S":"MTCH#man.united"},"hashKey":{"S":"TM#fcbarcelona"},"geohash":{"S":"66jcfp"}}'
                );
            }

            done();
        });
    }, 60000);

    test('Evaluate: Search teams 05', (done) => {
        params.Payload = JSON.stringify(events[4]);

        lambda.invoke(params, function (err, data) {
            if (err) {
                console.log(err);
                expect(err.StatusCode).toBe(400);
            } else {
                let response = JSON.parse(data.Payload);

                expect(data.StatusCode).toBe(200);
                expect(response.items).toStrictEqual([]);
                expect(response.nextToken).toStrictEqual(
                    '{"rangeKey":{"S":"MTCH#man.united"},"hashKey":{"S":"TM#fcbarcelona"},"geohash":{"S":"66jcfp"}}'
                );
            }

            done();
        });
    }, 60000);

    test('Evaluate: Search teams 06', (done) => {
        params.Payload = JSON.stringify(events[5]);

        lambda.invoke(params, function (err, data) {
            if (err) {
                console.log(err);
                expect(err.StatusCode).toBe(400);
            } else {
                let response = JSON.parse(data.Payload);

                expect(data.StatusCode).toBe(200);
                expect(response.items[0].id).toBe('acmilan');
                expect(response.items[1].id).toBe('bayern');
                expect(response.nextToken).toStrictEqual(
                    '{"rangeKey":{"S":"MTCH#man.united"},"hashKey":{"S":"TM#fcbarcelona"},"geohash":{"S":"66jcfp"}}'
                );
            }

            done();
        });
    }, 60000);
});
