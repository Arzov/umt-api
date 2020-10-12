const aws = require('aws-sdk')
const umtEnvs = require('../../../layers/umt-envs/nodejs/node_modules/umt-envs')
const event01 = require('../events/event01.json')
const event02 = require('../events/event02.json')

describe('Test AWS Lambda: umt-add-matchchat', () => {

  let lambda = new aws.Lambda(umtEnvs.dev.LAMBDA_CONFIG)
  let params = {FunctionName: 'umt-add-matchchat'}

  test('Evaluar respuesta: Match - Jugador (RPC - MAN. UNITED - fjbarrientosg@gmail.com)', (done) => {
    params.Payload = JSON.stringify(event01)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(200)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.teamId1).toBe('rpc')
        expect(response.teamId2).toBe('man.united')
        expect(response.userEmail).toBe('fjbarrientosg@gmail.com')
        expect(response.msg).toBe('Cuándo jugamos?')
      }

      done()
    })
  }, 60000)

  test('Evaluar respuesta: Match - Jugador (RPC - MAN. UNITED - matias.barrientos@arzov.com)', (done) => {
    params.Payload = JSON.stringify(event02)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(200)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.teamId1).toBe('rpc')
        expect(response.teamId2).toBe('man.united')
        expect(response.userEmail).toBe('matias.barrientos@arzov.com')
        expect(response.msg).toBe('Mañana!')
      }

      done()
    })
  }, 60000)
})