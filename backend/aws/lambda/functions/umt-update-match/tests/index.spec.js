const aws = require('aws-sdk')
const event = require('../events/event.json')

describe('Test AWS Lambda: umt-update-match', () => {

  let lambda = new aws.Lambda({
    apiVersion: '2015-03-31',
    region: 'us-east-1',
    endpoint: 'http://127.0.0.1:3001',
    sslEnabled: false
  })

  let params = {
    FunctionName: 'umt-update-match',
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
        expect(response.rangeKey).toBe('franco.barrientos@arzov.com')
      }

      done()
    })
  }, 60000)

})