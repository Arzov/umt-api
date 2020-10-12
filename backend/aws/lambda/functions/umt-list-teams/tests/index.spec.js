const aws = require('aws-sdk')
const umtEnvs = require('../../../layers/umt-envs/nodejs/node_modules/umt-envs')
const event = require('../events/event.json')

describe('Test AWS Lambda: umt-list-teams', () => {

  let lambda = new aws.Lambda(umtEnvs.dev.LAMBDA_CONFIG)
  let params = {FunctionName: 'umt-list-teams'}

  test('Evaluar respuesta: Usuario (fjbarrientosg@gmail.com)', (done) => {
    params.Payload = JSON.stringify(event)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(200)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.items[0].id).toBe('rpc')
        expect(response.nextToken).toBe(null)
      }

      done()
    })
  }, 60000)

})