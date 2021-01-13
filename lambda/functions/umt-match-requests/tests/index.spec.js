const aws = require('aws-sdk')
const umtEnvs = require('../../../layers/umt-envs/nodejs/node_modules/umt-envs')
const event01 = require('../events/event01.json')
const event02 = require('../events/event02.json')

describe('Test AWS Lambda: umt-match-requests', () => {

  let lambda = new aws.Lambda(umtEnvs.dev.LAMBDA_CONFIG)
  let params = {FunctionName: 'umt-match-requests'}

  test('Evaluar respuesta: Equipo (MAN. UNITED) Pt 1', (done) => {
    params.Payload = JSON.stringify(event01)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(200)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.items[0].teamId1).toBe('man.united')
        expect(response.items[0].teamId2).toBe('psg')
        expect(JSON.parse(response.items[0].reqStat)).toStrictEqual({AR: {S: 'A'}, RR: {S: 'P'}})
        expect(response.items[1].teamId1).toBe('bayern')
        expect(response.items[1].teamId2).toBe('man.united')
        expect(JSON.parse(response.items[1].reqStat)).toStrictEqual({AR: {S: 'A'}, RR: {S: 'P'}})
        expect(response.nextToken).toBe('{"rangeKey":{"S":"MATCH#psg"},"hashKey":{"S":"MATCH#man.united"}}&{"rangeKey":{"S":"MATCH#man.united"},"hashKey":{"S":"MATCH#bayern"}}')
      }

      done()
    })
  }, 60000)

  test('Evaluar respuesta: Equipo (MAN. UNITED) Pt 2', (done) => {
    params.Payload = JSON.stringify(event02)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(200)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.nextToken).toBe('{"rangeKey":{"S":"MATCH#realmadrid"},"hashKey":{"S":"MATCH#man.united"}}&{"rangeKey":{"S":"MATCH#man.united"},"hashKey":{"S":"MATCH#chelsea"}}')
      }

      done()
    })
  }, 60000)
})