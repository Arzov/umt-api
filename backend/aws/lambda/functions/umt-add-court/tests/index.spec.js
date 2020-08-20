const aws = require('aws-sdk')
const event = require('../events/event.json')

describe('Test AWS Lambda: umt-add-court', () => {

  let lambda = new aws.Lambda({
    apiVersion: '2015-03-31',
    region: 'us-east-1',
    endpoint: 'http://127.0.0.1:3001',
    sslEnabled: false
  })

  let params = {
    FunctionName: 'umt-add-court',
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
        expect(response.hashKey).toBe('66jcfp')
        expect(response.rangeKey).toBe('+56200000000')
        expect(response.geoJson[0]).toBe('-70.573615')
        expect(response.geoJson[1]).toBe('-33.399435')
        expect(response.matchType[0]).toBe('5v5')
        expect(response.matchType[1]).toBe('7v7')
        expect(response.matchType[2]).toBe('11v11')
        expect(response.name).toBe('RPC')
      }

      done()
    })
  }, 60000)

})