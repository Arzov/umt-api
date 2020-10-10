const aws = require('aws-sdk')
const event = require('../events/event.json')

describe('Test AWS Lambda: umt-list-teams', () => {

  let lambda = new aws.Lambda({
    apiVersion: '2015-03-31',
    region: 'us-east-1',
    endpoint: 'http://127.0.0.1:3001',
    sslEnabled: false
  })

  let params = {
    FunctionName: 'umt-list-teams'
  }

  test('Evaluar respuesta: Usuario (fjbarrientosg@gmail.com)', (done) => {
    params.Payload = JSON.stringify(event)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(200)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.items[0].id).toBe('rpc')
        expect(response.nextToken).toBe(null)
      }

      done()
    })
  }, 60000)

})