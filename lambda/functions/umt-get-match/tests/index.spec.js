const aws = require('aws-sdk')
const umtEnvs = require('../../../layers/umt-envs/nodejs/node_modules/umt-envs')
const events = require('../events/events.json')

describe('Test AWS Lambda: umt-get-match', () => {

  let lambda = new aws.Lambda(umtEnvs.dev.LAMBDA_CONFIG)
  let params = {FunctionName: 'umt-get-match'}

  test('Respuesta desde AWS: Partido MAN. UNITED - REAL MADRID', (done) => {
    params.Payload = JSON.stringify(events[0])

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(400)
      } else {
        let response = JSON.parse(data.Payload)
  
        expect(data.StatusCode).toBe(200)
        expect(response.teamId1).toBe('man.united')
        expect(response.teamId2).toBe('realmadrid')
        expect(response.allowedPatches).toBe('2')
        expect(response.positions).toStrictEqual(['GK'])
        expect(response.matchFilter).toStrictEqual(['11v11', '5v5'])
        expect(JSON.parse(response.schedule)).toStrictEqual({day: {S: '2020-11-03'}, time: {S: '20:50'}})
        expect(JSON.parse(response.reqStat)).toStrictEqual({RR: {S: 'A'}, AR: {S: 'A'}})
        expect(response.stadiumGeohash).toBe('')
        expect(response.stadiumId).toBe('')
        expect(response.courtId).toBe('0')
        expect(response.genderFilter).toStrictEqual(['M'])
        expect(response.ageMinFilter).toBe('20')
        expect(response.ageMaxFilter).toBe('40')
        expect(response.geohash).toBe('66jcfp')
      }
  
      done()
    })
  }, 60000)
})