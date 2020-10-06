const aws = require('aws-sdk')
const event = require('../events/event.json')

describe('Test AWS Lambda: umt-update-user', () => {

  let lambda = new aws.Lambda({
    apiVersion: '2015-03-31',
    region: 'us-east-1',
    endpoint: 'http://127.0.0.1:3001',
    sslEnabled: false
  })

  let params = {
    FunctionName: 'umt-update-user',
    Payload: JSON.stringify(event)
  }

  test('Evaluar respuesta desde AWS', (done) => {

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(200)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.email).toBe('fjbarrientosg@gmail.com')
        expect(response.geohash).toBe('66jcfp')
        expect(response.coords).toStrictEqual({ LON: { N: '-70.573615' }, LAT: { N: '-33.399435' } })
        expect(response.genderFilter).toStrictEqual([ 'M' ])
        expect(response.ageMinFilter).toBe('22')
        expect(response.ageMaxFilter).toBe('45')
        expect(response.matchFilter).toStrictEqual([ '5v5', '7v7', '11v11' ])
        expect(response.positions).toStrictEqual([ 'CF', 'LW', 'RW' ])
        expect(response.skills).toStrictEqual({ ATT: { N: '1' }, SPD: { N: '1' },
          TEC: { N: '1' }, TWK: { N: '1' }, FCE: { N: '1' }, DEF: { N: '1' } })
        expect(response.foot).toBe('R')
        expect(response.weight).toBe('80')
        expect(response.height).toBe('175')
      }

      done()
    })
  }, 60000)

})