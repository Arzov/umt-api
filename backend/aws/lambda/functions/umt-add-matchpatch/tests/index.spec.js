const aws = require('aws-sdk')
const umtEnvs = require('../../../layers/umt-envs/nodejs/node_modules/umt-envs')
const event01 = require('../events/event01.json')
const event02 = require('../events/event02.json')
const event03 = require('../events/event03.json')
const event04 = require('../events/event04.json')

describe('Test AWS Lambda: umt-add-matchpatch', () => {

  let lambda = new aws.Lambda(umtEnvs.dev.LAMBDA_CONFIG)
  let params = {FunctionName: 'umt-add-matchpatch'}

  test('Evaluar respuesta: Parche - Match (franco.barrientos@arzov.com, BAYERN - PSG)', (done) => {
    params.Payload = JSON.stringify(event01)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(200)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.teamId1).toBe('bayern')
        expect(response.teamId2).toBe('psg')
        expect(response.userEmail).toBe('franco.barrientos@arzov.com')
        expect(response.reqStat).toStrictEqual({MR: {S: 'A'}, PR: {S: 'A'}})
      }

      done()
    })
  }, 60000)

  test('Evaluar respuesta: Match - Parche (PSG - BAYERN, franco.barrientos@arzov.com)', (done) => {
    params.Payload = JSON.stringify(event02)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(200)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.reqStat).toStrictEqual({MR: {S: 'A'}, PR: {S: 'A'}})
      }

      done()
    })
  }, 60000)

  test('Evaluar respuesta: Match - Parche (CHELSEA - PSG, franco.barrientos@arzov.com)', (done) => {
    params.Payload = JSON.stringify(event03)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(200)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.teamId1).toBe('chelsea')
        expect(response.teamId2).toBe('psg')
        expect(response.userEmail).toBe('franco.barrientos@arzov.com')
        expect(response.reqStat).toStrictEqual({MR: {S: 'A'}, PR: {S: 'P'}})
      }

      done()
    })
  }, 60000)

  test('Evaluar respuesta: Parche - Match (svonko.vescovi@arzov.com, MAN. UNITED - REAL MADRID)', (done) => {
    params.Payload = JSON.stringify(event04)

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
        expect(response.reqStat).toStrictEqual({MR: {S: 'A'}, PR: {S: 'A'}})
      }

      done()
    })
  }, 60000)
})