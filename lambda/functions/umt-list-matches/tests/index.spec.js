const aws = require('aws-sdk')
const umtEnvs = require('../../../layers/umt-envs/nodejs/node_modules/umt-envs')
const event01 = require('../events/event01.json')
const event02 = require('../events/event02.json')
const event03 = require('../events/event03.json')
const event04 = require('../events/event04.json')

describe('Test AWS Lambda: umt-list-matches', () => {

  let lambda = new aws.Lambda(umtEnvs.dev.LAMBDA_CONFIG)
  let params = {FunctionName: 'umt-list-matches'}

  test('Evaluar respuesta: Equipo (MAN. UNITED) Pt 1', (done) => {
    params.Payload = JSON.stringify(event01)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(200)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.items).toStrictEqual([])
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
        expect(response.items[0]).toStrictEqual({teamId1: 'man.united', teamId2: 'realmadrid'})
        expect(response.items[1]).toStrictEqual({teamId1: 'chelsea', teamId2: 'man.united'})
        expect(response.nextToken).toBe('{"rangeKey":{"S":"MATCH#realmadrid"},"hashKey":{"S":"MATCH#man.united"}}&{"rangeKey":{"S":"MATCH#man.united"},"hashKey":{"S":"MATCH#chelsea"}}')
      }

      done()
    })
  }, 60000)

  test('Evaluar respuesta: Equipo (PSG)', (done) => {
    params.Payload = JSON.stringify(event03)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(200)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.items[0]).toStrictEqual({teamId1: 'bayern', teamId2: 'psg'})
        expect(response.nextToken).toBe('&{"rangeKey":{"S":"MATCH#psg"},"hashKey":{"S":"MATCH#bayern"}}')
      }

      done()
    })
  }, 60000)

  test('Evaluar respuesta: Parche (franco.barrientos@arzov.com)', (done) => {
    params.Payload = JSON.stringify(event04)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(200)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.items[0]).toStrictEqual({teamId1: 'bayern', teamId2: 'psg'})
        expect(response.nextToken).toBe('{"rangeKey":{"S":"PATCH#franco.barrientos@arzov.com"},"hashKey":{"S":"MATCH#bayern#psg"}}')
      }

      done()
    })
  }, 60000)
})