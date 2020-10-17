const aws = require('aws-sdk')
const umtEnvs = require('../../../layers/umt-envs/nodejs/node_modules/umt-envs')
const event01 = require('../events/event01.json')
const event02 = require('../events/event02.json')
const event03 = require('../events/event03.json')
const event04 = require('../events/event04.json')
const event05 = require('../events/event05.json')
const event06 = require('../events/event06.json')

describe('Test AWS Lambda: umt-add-team', () => {

  let lambda = new aws.Lambda(umtEnvs.dev.LAMBDA_CONFIG)
  let params = {FunctionName: 'umt-add-team'}

  test('Evaluar respuesta: Equipo (REAL MADRID)', (done) => {
    params.Payload = JSON.stringify(event01)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(200)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.geohash).toBe('66jcfp')
        expect(response.id).toBe('realmadrid')
        expect(response.name).toBe('REAL MADRID')
        expect(response.picture).toBe('')
        expect(response.formation).toStrictEqual(umtEnvs.dft.TEAM.FORMATION)
        expect(response.searchingPlayers).toBe(false)
      }

      done()
    })
  }, 60000)

  test('Evaluar respuesta: Equipo (MAN. UNITED)', (done) => {
    params.Payload = JSON.stringify(event02)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(200)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.geohash).toBe('66jcfp')
        expect(response.id).toBe('man.united')
        expect(response.name).toBe('MAN. UNITED')
        expect(response.picture).toBe('')
        expect(response.formation).toStrictEqual(umtEnvs.dft.TEAM.FORMATION)
        expect(response.searchingPlayers).toBe(false)
      }

      done()
    })
  }, 60000)

  test('Evaluar respuesta: Equipo (FC BARCELONA)', (done) => {
    params.Payload = JSON.stringify(event03)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(200)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.geohash).toBe('66jcfp')
        expect(response.id).toBe('fcbarcelona')
        expect(response.name).toBe('FC BARCELONA')
        expect(response.picture).toBe('')
        expect(response.formation).toStrictEqual(umtEnvs.dft.TEAM.FORMATION)
        expect(response.searchingPlayers).toBe(true)
      }

      done()
    })
  }, 60000)

  test('Evaluar respuesta: Equipo (PSG)', (done) => {
    params.Payload = JSON.stringify(event04)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(200)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.geohash).toBe('66jcfp')
        expect(response.id).toBe('psg')
        expect(response.name).toBe('PSG')
        expect(response.picture).toBe('')
        expect(response.formation).toStrictEqual(umtEnvs.dft.TEAM.FORMATION)
        expect(response.searchingPlayers).toBe(true)
      }

      done()
    })
  }, 60000)

  test('Evaluar respuesta: Equipo (BAYERN)', (done) => {
    params.Payload = JSON.stringify(event05)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(200)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.geohash).toBe('66jcfp')
        expect(response.id).toBe('bayern')
        expect(response.name).toBe('BAYERN')
        expect(response.picture).toBe('')
        expect(response.formation).toStrictEqual(umtEnvs.dft.TEAM.FORMATION)
        expect(response.searchingPlayers).toBe(true)
      }

      done()
    })
  }, 60000)

  test('Evaluar respuesta: Equipo (CHELSEA)', (done) => {
    params.Payload = JSON.stringify(event06)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(200)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.geohash).toBe('66jcfp')
        expect(response.id).toBe('chelsea')
        expect(response.name).toBe('CHELSEA')
        expect(response.picture).toBe('')
        expect(response.formation).toStrictEqual(umtEnvs.dft.TEAM.FORMATION)
        expect(response.searchingPlayers).toBe(true)
      }

      done()
    })
  }, 60000)
})