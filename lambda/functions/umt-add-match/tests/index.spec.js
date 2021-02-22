const aws = require('aws-sdk')
const umtEnvs = require('../../../layers/umt-envs/nodejs/node_modules/umt-envs')
const events = require('../events/events.json')

describe('Test AWS Lambda: umt-add-match', () => {

  let lambda = new aws.Lambda(umtEnvs.dev.LAMBDA_CONFIG)
  let params = {FunctionName: 'umt-add-match'}

  test('Evaluar respuesta: Partido (MAN. UNITED - REAL MADRID)', (done) => {
    params.Payload = JSON.stringify(events[0])

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(200)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.teamId1).toBe('man.united')
        expect(response.teamId2).toBe('realmadrid')
        expect(response.allowedPatches).toBe('1')
        expect(response.positions).toStrictEqual([''])
        expect(response.ageMinFilter).toBe('20')
        expect(response.ageMaxFilter).toBe('40')
        expect(response.matchFilter).toStrictEqual(['5v5', '11v11'])
        expect(JSON.parse(response.schedule)).toStrictEqual({day: {S: '2020-09-02'}, time: {S: '18:45'} })
        expect(JSON.parse(response.reqStat)).toStrictEqual({AR: {S: 'A'}, RR: {S: 'P'}})
        expect(response.geohash).toBe('66jcfp')
        expect(response.stadiumGeohash).toBe('')
        expect(response.stadiumId).toBe('')
        expect(response.courtId).toBe('0')
        expect(response.genderFilter).toStrictEqual(['M'])
      }

      done()
    })
  }, 60000)

  test('Evaluar respuesta: Partido (REAL MADRID - MAN. UNITED)', (done) => {
    params.Payload = JSON.stringify(events[1])

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(200)
      } else {
        let response = JSON.parse(data.Payload)
        
        expect(data.StatusCode).toBe(200)
        expect(response.teamId1).toBe('man.united')
      }

      done()
    })
  }, 60000)

  test('Evaluar respuesta: Partido (FC BARCELONA - MAN. UNITED)', (done) => {
    params.Payload = JSON.stringify(events[2])

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(200)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.teamId1).toBe('fcbarcelona')
        expect(response.teamId2).toBe('man.united')
        expect(response.allowedPatches).toBe('0')
        expect(response.positions).toStrictEqual([''])
        expect(response.ageMinFilter).toBe('20')
        expect(response.ageMaxFilter).toBe('40')
        expect(response.matchFilter).toStrictEqual(['5v5'])
        expect(JSON.parse(response.reqStat)).toStrictEqual({AR: {S: 'A'}, RR: {S: 'P'}})
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