const aws = require('aws-sdk')
const umtEnvs = require('../../../layers/umt-envs/nodejs/node_modules/umt-envs')
const events = require('../events/events.json')

describe('Test AWS Lambda: umt-match-requests', () => {

  let lambda = new aws.Lambda(umtEnvs.dev.LAMBDA_CONFIG)
  let params = {FunctionName: 'umt-match-requests'}

  test('Evaluar respuesta: Equipo (MAN. UNITED)', (done) => {
    params.Payload = JSON.stringify(events[0])

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(200)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.items[0].teamId1).toBe('fcbarcelona')
        expect(response.items[0].teamId2).toBe('man.united')
        expect(JSON.parse(response.items[0].reqStat)).toStrictEqual({AR: {S: 'A'}, RR: {S: 'P'}})
        expect(response.nextToken).toBe('&')
      }

      done()
    })
  }, 60000)
})