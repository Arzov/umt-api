const aws = require('aws-sdk')
const umtEnvs = require('../../../layers/umt-envs/nodejs/node_modules/umt-envs')
const event = require('../events/event.json')

describe('Test AWS Lambda: umt-update-user', () => {

  let lambda = new aws.Lambda(umtEnvs.dev.LAMBDA_CONFIG)
  let params = {FunctionName: 'umt-update-user'}

  test('Evaluar respuesta desde AWS', (done) => {
    params.Payload = JSON.stringify(event)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(200)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.email).toBe('franco.barrientos@arzov.com')
        expect(response.geohash).toBe('66jcfp')
        expect(JSON.parse(response.coords)).toStrictEqual({LON: {N: '-70.573615'}, LAT: {N: '-33.399435'}})
        expect(response.genderFilter).toStrictEqual(['M'])
        expect(response.ageMinFilter).toBe('22')
        expect(response.ageMaxFilter).toBe('45')
        expect(response.matchFilter).toStrictEqual(['5v5', '7v7', '11v11'])
        expect(response.positions).toStrictEqual(['CF', 'LW', 'RW'])
        expect(JSON.parse(response.skills)).toStrictEqual(umtEnvs.dft.USER.SKILLS)
        expect(response.foot).toBe('R')
        expect(response.weight).toBe('80')
        expect(response.height).toBe('175')
      }

      done()
    })
  }, 60000)
})