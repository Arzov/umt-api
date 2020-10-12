const aws = require('aws-sdk')
const umtEnvs = require('../../../layers/umt-envs/nodejs/node_modules/umt-envs')
const event01 = require('../events/event01.json')
const event02 = require('../events/event02.json')
const event03 = require('../events/event03.json')

describe('Test AWS Lambda: umt-add-match', () => {

  let lambda = new aws.Lambda(umtEnvs.dev.LAMBDA_CONFIG)
  let params = {FunctionName: 'umt-add-match'}

  test('Evaluar respuesta: Equipos (RPC - MAN. UNITED)', (done) => {
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
        expect(response.allowedPatches).toBe('0')
        expect(response.positions).toStrictEqual([''])
        expect(response.matchTypes).toStrictEqual(['7v7'])
        expect(response.schedule).toStrictEqual({day: {S: '2020-09-02'}, time: {S: '18:45'} })
        expect(response.reqStat).toStrictEqual({AR: {S: 'A'}, RR: {S: 'P'}})
        expect(response.geohash).toBe('66jcfp')
        expect(response.stadiumGeohash).toBe('')
        expect(response.stadiumId).toBe('')
        expect(response.courtId).toBe('0')
        expect(response.genderFilter).toStrictEqual(['M'])
      }

      done()
    })
  }, 60000)

  test('Evaluar respuesta: Equipos (MAN. UNITED - RPC)', (done) => {
    params.Payload = JSON.stringify(event02)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(200)
      } else {
        let response = JSON.parse(data.Payload)
        
        expect(data.StatusCode).toBe(200)
        expect(response.teamId1).toBe('rpc')
      }

      done()
    })
  }, 60000)

  test('Evaluar respuesta: Equipos (MAN. UNITED - FC BARCELONA)', (done) => {
    params.Payload = JSON.stringify(event03)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(200)
      } else {
        let response = JSON.parse(data.Payload)
        
        expect(data.StatusCode).toBe(200)
        expect(response.teamId1).toBe('man.united')
        expect(response.teamId2).toBe('fcbarcelona')
        expect(response.allowedPatches).toBe('2')
        expect(response.positions).toStrictEqual([''])
        expect(response.matchTypes).toStrictEqual(['7v7'])
        expect(response.reqStat).toStrictEqual({AR: {S: 'A'}, RR: {S: 'P'}})
        expect(response.geohash).toBe('66jcfp')
        expect(response.stadiumGeohash).toBe('')
        expect(response.stadiumId).toBe('')
        expect(response.courtId).toBe('0')
        expect(response.genderFilter).toStrictEqual(['M'])
      }

      done()
    })
  }, 60000)
})