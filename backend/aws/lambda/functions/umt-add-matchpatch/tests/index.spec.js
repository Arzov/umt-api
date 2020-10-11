const aws = require('aws-sdk')
const event01 = require('../events/event01.json')
const event02 = require('../events/event02.json')
const event03 = require('../events/event03.json')

describe('Test AWS Lambda: umt-add-matchpatch', () => {

  let lambda = new aws.Lambda({
    apiVersion: '2015-03-31',
    region: 'us-east-1',
    endpoint: 'http://127.0.0.1:3001',
    sslEnabled: false
  })

  let params = {
    FunctionName: 'umt-add-matchpatch'
  }

  test('Evaluar respuesta: Parche - Match (svonko.vescovi@arzov.com, RPC - MAN. UNITED)', (done) => {
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
        expect(response.userEmail).toBe('svonko.vescovi@arzov.com')
        expect(response.reqStat).toStrictEqual({TR: {S: 'A'}, PR: {S: 'A'}})
      }

      done()
    })
  }, 60000)

  test('Evaluar respuesta: Match - Parche (RPC - MAN. UNITED, svonko.vescovi@arzov.com)', (done) => {
    params.Payload = JSON.stringify(event02)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(200)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.reqStat).toStrictEqual({TR: {S: 'A'}, PR: {S: 'A'}})
      }

      done()
    })
  }, 60000)

  test('Evaluar respuesta: Match - Parche (RPC - MAN. UNITED, diego.lagos@arzov.com)', (done) => {
    params.Payload = JSON.stringify(event03)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(200)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.teamId1).toBe('rpc')
        expect(response.teamId2).toBe('man.united')
        expect(response.userEmail).toBe('diego.lagos@arzov.com')
        expect(response.reqStat).toStrictEqual({TR: {S: 'A'}, PR: {S: 'P'}})
      }

      done()
    })
  }, 60000)
})