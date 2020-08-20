const aws = require('aws-sdk')
const event01 = require('../events/event01.json')
const event02 = require('../events/event02.json')
const event03 = require('../events/event03.json')

describe('Test AWS Lambda: umt-add-user', () => {

  let lambda = new aws.Lambda({
    apiVersion: '2015-03-31',
    region: 'us-east-1',
    endpoint: 'http://127.0.0.1:3001',
    sslEnabled: false
  })

  let params = {
    FunctionName: 'umt-add-user'
  }

  test('Evaluar respuesta: Usuario (fjbarrientosg@gmail.com)', (done) => {

    params.Payload = JSON.stringify(event01)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(200)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.hashKey).toBe('66jcbp')
        expect(response.rangeKey).toBe('fjbarrientosg@gmail.com')
        expect(response.geoJson[0]).toBe('-70.6573578')
        expect(response.geoJson[1]).toBe('-33.3990387')
        expect(response.genderFilter).toBe('M')
        expect(response.matchFilter).toBe('5v5')
      }

      done()
    })
  }, 60000)

  test('Evaluar respuesta: Usuario (franco.barrientos@arzov.com)', (done) => {

    params.Payload = JSON.stringify(event02)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(200)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.hashKey).toBe('66jcbp')
        expect(response.rangeKey).toBe('franco.barrientos@arzov.com')
        expect(response.geoJson[0]).toBe('-70.6573578')
        expect(response.geoJson[1]).toBe('-33.3990387')
        expect(response.genderFilter).toBe('M')
        expect(response.matchFilter).toBe('5v5')
      }

      done()
    })
  }, 60000)

  test('Evaluar respuesta: Usuario (jesus.barrientos@arzov.com)', (done) => {

    params.Payload = JSON.stringify(event03)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(200)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.hashKey).toBe('66jcbp')
        expect(response.rangeKey).toBe('jesus.barrientos@arzov.com')
        expect(response.geoJson[0]).toBe('-70.6573578')
        expect(response.geoJson[1]).toBe('-33.3990387')
        expect(response.genderFilter).toBe('M')
        expect(response.matchFilter).toBe('5v5')
      }

      done()
    })
  }, 60000)

})