const aws = require('aws-sdk')
const umtEnvs = require('../../../layers/umt-envs/nodejs/node_modules/umt-envs')
const event01 = require('../events/event01.json')
const event02 = require('../events/event02.json')
const event03 = require('../events/event03.json')
const event04 = require('../events/event04.json')
const event05 = require('../events/event05.json')
const event06 = require('../events/event06.json')
const event07 = require('../events/event07.json')

describe('Test AWS Lambda: umt-update-match', () => {

  let lambda = new aws.Lambda(umtEnvs.dev.LAMBDA_CONFIG)
  let params = {FunctionName: 'umt-update-match'}

  test('Evaluar respuesta: Partido (MAN. UNITED - REAL MADRID)', (done) => {
    params.Payload = JSON.stringify(event01)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(200)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.teamId1).toBe('man.united')
        expect(response.teamId2).toBe('realmadrid')
        expect(response.allowedPatches).toBe('2')
        expect(response.positions).toStrictEqual(['GK'])
        expect(response.matchTypes).toStrictEqual(['7v7'])
        expect(JSON.parse(response.schedule)).toStrictEqual({day: {S: '2020-11-03'}, time: {S: '20:50'}})
        expect(JSON.parse(response.reqStat)).toStrictEqual({AR: {S: 'A'}, RR: {S: 'A'}})
        expect(response.stadiumGeohash).toBe('')
        expect(response.stadiumId).toBe('')
        expect(response.courtId).toBe('0')
        expect(response.genderFilter).toStrictEqual(['M'])
      }

      done()
    })
  }, 60000)

  test('Evaluar respuesta: Partido (CHELSEA - MAN. UNITED)', (done) => {
    params.Payload = JSON.stringify(event02)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(200)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.teamId1).toBe('chelsea')
        expect(response.teamId2).toBe('man.united')
        expect(response.allowedPatches).toBe('2')
        expect(response.positions).toStrictEqual([''])
        expect(response.matchTypes).toStrictEqual(['7v7'])
        expect(JSON.parse(response.schedule)).toStrictEqual({day: {S: '2020-12-03'}, time: {S: '20:50'}})
        expect(JSON.parse(response.reqStat)).toStrictEqual({AR: {S: 'A'}, RR: {S: 'A'}})
        expect(response.stadiumGeohash).toBe('')
        expect(response.stadiumId).toBe('')
        expect(response.courtId).toBe('0')
        expect(response.genderFilter).toStrictEqual(['M'])
      }

      done()
    })
  }, 60000)

  test('Evaluar respuesta: Partido (BAYERN - PSG)', (done) => {
    params.Payload = JSON.stringify(event03)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(200)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.teamId1).toBe('bayern')
        expect(response.teamId2).toBe('psg')
        expect(response.allowedPatches).toBe('3')
        expect(response.positions).toStrictEqual([''])
        expect(response.matchTypes).toStrictEqual(['7v7'])
        expect(JSON.parse(response.schedule)).toStrictEqual({day: {S: '2020-12-03'}, time: {S: '20:50'}})
        expect(JSON.parse(response.reqStat)).toStrictEqual({AR: {S: 'A'}, RR: {S: 'A'}})
        expect(response.stadiumGeohash).toBe('')
        expect(response.stadiumId).toBe('')
        expect(response.courtId).toBe('0')
        expect(response.genderFilter).toStrictEqual(['M'])
      }

      done()
    })
  }, 60000)

  test('Evaluar respuesta: Partido (CHELSEA - PSG)', (done) => {
    params.Payload = JSON.stringify(event04)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(200)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.teamId1).toBe('chelsea')
        expect(response.teamId2).toBe('psg')
        expect(response.allowedPatches).toBe('0')
        expect(response.positions).toStrictEqual([''])
        expect(response.matchTypes).toStrictEqual(['7v7'])
        expect(JSON.parse(response.schedule)).toStrictEqual({day: {S: '2020-12-03'}, time: {S: '20:50'}})
        expect(JSON.parse(response.reqStat)).toStrictEqual({AR: {S: 'A'}, RR: {S: 'A'}})
        expect(response.stadiumGeohash).toBe('')
        expect(response.stadiumId).toBe('')
        expect(response.courtId).toBe('0')
        expect(response.genderFilter).toStrictEqual(['M'])
      }

      done()
    })
  }, 60000)

  test('Evaluar respuesta: Partido (FC BARCELONA - CHELSEA)', (done) => {
    params.Payload = JSON.stringify(event05)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(200)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.teamId1).toBe('')
      }

      done()
    })
  }, 60000)

  test('Evaluar respuesta: Partido (BAYERN - CHELSEA)', (done) => {
    params.Payload = JSON.stringify(event06)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(200)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.teamId1).toBe('')
      }

      done()
    })
  }, 60000)

  test('Evaluar respuesta: Partido (BAYERN - CHELSEA)', (done) => {
    params.Payload = JSON.stringify(event07)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(200)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.teamId1).toBe('')
      }

      done()
    })
  }, 60000)
})