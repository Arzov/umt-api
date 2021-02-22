const aws = require('aws-sdk')
const umtEnvs = require('../../../layers/umt-envs/nodejs/node_modules/umt-envs')
const events = require('../events/events.json')

describe('Test AWS Lambda: umt-near-matches', () => {

  let lambda = new aws.Lambda(umtEnvs.dev.LAMBDA_CONFIG)
  let params = {FunctionName: 'umt-near-matches'}

  test('Evaluar respuesta: Parte 1', (done) => {
    params.Payload = JSON.stringify(events[0])

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(400)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.nextToken).toBe(null) 
      }

      done()
    })
  }, 60000)

  test('Evaluar respuesta: Parte 2', (done) => {
    params.Payload = JSON.stringify(events[1])

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(400)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.items[0].teamId1).toBe('man.united')
        expect(response.items[0].teamId2).toBe('realmadrid')
        expect(response.nextToken).toBe(null) 
      }

      done()
    })
  }, 60000)
})