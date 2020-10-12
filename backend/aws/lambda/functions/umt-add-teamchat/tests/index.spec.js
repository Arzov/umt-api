const aws = require('aws-sdk')
const umtEnvs = require('../../../layers/umt-envs/nodejs/node_modules/umt-envs')
const event01 = require('../events/event01.json')
const event02 = require('../events/event02.json')

describe('Test AWS Lambda: umt-add-teamchat', () => {

  let lambda = new aws.Lambda(umtEnvs.dev.LAMBDA_CONFIG)
  let params = {FunctionName: 'umt-add-teamchat'}

  test('Evaluar respuesta: Equipo - Miembro (RPC - fjbarrientosg@gmail.com)', (done) => {
    params.Payload = JSON.stringify(event01)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(200)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.teamId).toBe('rpc')
        expect(response.userEmail).toBe('fjbarrientosg@gmail.com')
        expect(response.msg).toBe('Hola a todos!')
      }

      done()
    })
  }, 60000)

  test('Evaluar respuesta: Equipo - Miembro (RPC - jesus.barrientos@arzov.com)', (done) => {
    params.Payload = JSON.stringify(event02)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(200)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.teamId).toBe('rpc')
        expect(response.userEmail).toBe('jesus.barrientos@arzov.com')
        expect(response.msg).toBe('Hola! :)')
      }

      done()
    })
  }, 60000)
})