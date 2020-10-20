const aws = require('aws-sdk')
const umtEnvs = require('../../../layers/umt-envs/nodejs/node_modules/umt-envs')
const event = require('../events/event.json')

describe('Test AWS Lambda: umt-get-user', () => {

  let lambda = new aws.Lambda(umtEnvs.dev.LAMBDA_CONFIG)
  let params = {FunctionName: 'umt-get-user'}

  test('Respuesta desde AWS: Usuario franco.barrientos@arzov.com', (done) => {

    params.Payload = JSON.stringify(event)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(400)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.email).toBe('franco.barrientos@arzov.com')
        expect(response.geohash).toBe('66jcfp')
        expect(response.coords).toStrictEqual({LON: {N: '-70.573615'}, LAT: {N: '-33.399435'}})
        expect(response.genderFilter).toStrictEqual(['M'])
        expect(response.ageMinFilter).toBe('20')
        expect(response.ageMaxFilter).toBe('40')
        expect(response.matchFilter).toStrictEqual(['11v11', '5v5', '7v7'])
        expect(response.positions).toStrictEqual(['CF', 'LW', 'RW'])
        expect(response.foot).toBe('R')
      }

      done()
    })
  }, 60000)
})