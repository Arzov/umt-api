const aws = require('aws-sdk')
const event01 = require('../events/event01.json')
const event02 = require('../events/event02.json')
const event03 = require('../events/event03.json')

describe('Test AWS Lambda: umt-add-court', () => {

  let lambda = new aws.Lambda({
    apiVersion: '2015-03-31',
    region: 'us-east-1',
    endpoint: 'http://127.0.0.1:3001',
    sslEnabled: false
  })

  let params = {
    FunctionName: 'umt-add-court'
  }

  test('Evaluar respuesta: Cancha (#1)', (done) => {
    params.Payload = JSON.stringify(event01)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(200)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.stadiumId).toBe('clubdeportivoindepe')
        expect(response.stadiumGeohash).toBe('66jcfp')
        expect(response.id).toBe('1')
        expect(response.matchTypes).toStrictEqual(['7v7'])
        expect(response.material).toBe('Grass')
      }

      done()
    })
  }, 60000)

  test('Evaluar respuesta: Cancha (#2)', (done) => {
    params.Payload = JSON.stringify(event02)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(200)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.stadiumId).toBe('clubdeportivoindepe')
        expect(response.stadiumGeohash).toBe('66jcfp')
        expect(response.id).toBe('2')
        expect(response.matchTypes).toStrictEqual(['5v5'])
        expect(response.material).toBe('Cement')
      }

      done()
    })
  }, 60000)

  test('Evaluar respuesta: Cancha (#3)', (done) => {
    params.Payload = JSON.stringify(event03)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(200)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.stadiumId).toBe('clubdeportivoindepe')
        expect(response.stadiumGeohash).toBe('66jcfp')
        expect(response.id).toBe('3')
        expect(response.matchTypes).toStrictEqual(['5v5'])
        expect(response.material).toBe('Wood')
      }

      done()
    })
  }, 60000)
})