/**
 * Test: umt-list-teams
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


// packages

const aws = require('aws-sdk');
const umtEnvs = require('../../../layers/umt-envs/nodejs/node_modules/umt-envs');
const events = require('../events/events.json');


// execution

describe('Test AWS Lambda: umt-list-teams', () => {

    let lambda = new aws.Lambda(umtEnvs.dev.LAMBDA_CONFIG);
    let params = { FunctionName: 'umt-list-teams' };


    // test 1

    test('Evaluate: User (franco.barrientos@arzov.com)', (done) => {

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
                expect(response.items[0].id).toBe('man.united');
                expect(response.items[0].name).toBe('MAN. UNITED');
                expect(response.items[0].picture).toBe('');
                expect(JSON.parse(response.items[0].formation)).toStrictEqual(
                    umtEnvs.dft.TEAM.FORMATION
                );
                expect(response.items[0].geohash).toBe('66jcfp');
                expect(JSON.parse(response.items[0].coords)).toStrictEqual({
                    LON: { N: '-70.573615' },
                    LAT: { N: '-33.399435' },
                });
                expect(response.nextToken).toBe(null);
            }

            done();
        });
    }, 60000);
});
