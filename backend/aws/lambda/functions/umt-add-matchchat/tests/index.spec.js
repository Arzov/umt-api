const aws = require('aws-sdk')
const umtEnvs = require('../../../layers/umt-envs/nodejs/node_modules/umt-envs')
const event01 = require('../events/event01.json')
const event02 = require('../events/event02.json')

describe('Test AWS Lambda: umt-add-matchchat', () => {

  let lambda = new aws.Lambda(umtEnvs.dev.LAMBDA_CONFIG)
  let params = {FunctionName: 'umt-add-matchchat'}

  test('Evaluar respuesta: Match - Jugador (MAN. UNITED - REAL MADRID, svonko.vescovi@arzov.com)', (done) => {
    params.Payload = JSON.stringify(event01)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(200)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.teamId1).toBe('man.united')
        expect(response.teamId2).toBe('realmadrid')
        expect(response.userEmail).toBe('svonko.vescovi@arzov.com')
        expect(response.msg).toBe('Hola, como están?')
      }

      done()
    })
  }, 60000)

  test('Evaluar respuesta: Match - Jugador (MAN. UNITED - REAL MADRID, franco.barrientos@arzov.com)', (done) => {
    params.Payload = JSON.stringify(event02)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(200)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.teamId1).toBe('man.united')
        expect(response.teamId2).toBe('realmadrid')
        expect(response.userEmail).toBe('franco.barrientos@arzov.com')
        expect(response.msg).toBe('A qué hora jugamos?')
      }

      done()
    })
  }, 60000)
})