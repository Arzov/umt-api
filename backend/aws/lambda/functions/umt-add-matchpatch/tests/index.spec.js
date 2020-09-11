const aws = require('aws-sdk')
const event01 = require('../events/event01.json')

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

  test('Evaluar respuesta: Parche (svonko.vescovi@arzov.com)', (done) => {
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
        expect(response.status).toStrictEqual({ PS: { S: 'P' } })
      }

      done()
    })
  }, 60000)
})