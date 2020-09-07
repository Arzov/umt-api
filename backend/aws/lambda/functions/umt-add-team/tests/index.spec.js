const aws = require('aws-sdk')
const event01 = require('../events/event01.json')
const event02 = require('../events/event02.json')

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
        expect(response.email).toBe('fjbarrientosg@gmail.com')
        expect(response.geohash).toBe('66jcfp')
        expect(response.coords.LON.N).toBe('-70.573615')
        expect(response.coords.LAT.N).toBe('-33.399435')
        expect(response.ageMinFilter).toBe('20')
        expect(response.ageMaxFilter).toBe('40')
        expect(response.matchFilter).toStrictEqual(['5v5', '7v7', '11v11'])
        expect(response.genderFilter).toStrictEqual(['M'])
        expect(response.positions).toStrictEqual(['CF', 'LW', 'RW'])
        expect(response.skills).toStrictEqual({ ATT: { N: '1' }, SPD: { N: '1' },
          TEC: { N: '1' }, TWK: { N: '1' }, FCE: { N: '1' }, DEF: { N: '1' } })
        expect(response.foot).toBe('R')
        expect(response.weight).toBe('75')
        expect(response.height).toBe('175')
      }

      done()
    })
  }, 60000)

  test('Evaluar respuesta: Usuario (jesus.barrientos@arzov.com)', (done) => {
    params.Payload = JSON.stringify(event02)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(200)
      } else {
        let response = JSON.parse(data.Payload)

        expect(response.email).toBe('jesus.barrientos@arzov.com')
        expect(response.geohash).toBe('66jcfp')
        expect(response.coords.LON.N).toBe('-70.573615')
        expect(response.coords.LAT.N).toBe('-33.399435')
        expect(response.ageMinFilter).toBe('20')
        expect(response.ageMaxFilter).toBe('40')
        expect(response.matchFilter).toStrictEqual(['5v5', '7v7'])
        expect(response.genderFilter).toStrictEqual(['M'])
        expect(response.positions).toStrictEqual([''])
        expect(response.skills).toStrictEqual({ ATT: { N: '1' }, SPD: { N: '1' },
          TEC: { N: '1' }, TWK: { N: '1' }, FCE: { N: '1' }, DEF: { N: '1' } })
        expect(response.foot).toBe('')
        expect(response.weight).toBe('80')
        expect(response.height).toBe('170')
      }

      done()
    })
  }, 60000)
})