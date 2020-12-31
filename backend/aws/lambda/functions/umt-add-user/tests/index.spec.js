const aws = require('aws-sdk')
const umtEnvs = require('../../../layers/umt-envs/nodejs/node_modules/umt-envs')
const event01 = require('../events/event01.json')
const event02 = require('../events/event02.json')
const event03 = require('../events/event03.json')
const event04 = require('../events/event04.json')
const event05 = require('../events/event05.json')
const event06 = require('../events/event06.json')

describe('Test AWS Lambda: umt-add-user', () => {

  let lambda = new aws.Lambda(umtEnvs.dev.LAMBDA_CONFIG)
  let params = {FunctionName: 'umt-add-user'}

  test('Evaluar respuesta: Usuario (franco.barrientos@arzov.com)', (done) => {
    params.Payload = JSON.stringify(event01)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(200)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.email).toBe('franco.barrientos@arzov.com')
        expect(response.geohash).toBe('66jcfp')
        expect(JSON.parse(response.coords).LON.N).toBe('-70.573615')
        expect(JSON.parse(response.coords).LAT.N).toBe('-33.399435')
        expect(response.ageMinFilter).toBe('20')
        expect(response.ageMaxFilter).toBe('40')
        expect(response.matchFilter).toStrictEqual(['5v5', '7v7', '11v11'])
        expect(response.genderFilter).toStrictEqual(['M'])
        expect(response.positions).toStrictEqual(['CF', 'LW', 'RW'])
        expect(JSON.parse(response.skills)).toStrictEqual(umtEnvs.dft.USER.SKILLS)
        expect(response.foot).toBe('R')
        expect(response.weight).toBe('75')
        expect(response.height).toBe('175')
      }

      done()
    })
  }, 60000)

  test('Evaluar respuesta: Usuario (jesus.barrientos@arzov.com)', (done) => {
    params.Payload = JSON.stringify(event02)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(200)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.email).toBe('jesus.barrientos@arzov.com')
        expect(response.geohash).toBe('66jcfp')
        expect(JSON.parse(response.coords).LON.N).toBe('-70.573615')
        expect(JSON.parse(response.coords).LAT.N).toBe('-33.399435')
        expect(response.ageMinFilter).toBe('20')
        expect(response.ageMaxFilter).toBe('40')
        expect(response.matchFilter).toStrictEqual(['5v5', '7v7'])
        expect(response.genderFilter).toStrictEqual(['M'])
        expect(response.positions).toStrictEqual([''])
        expect(JSON.parse(response.skills)).toStrictEqual(umtEnvs.dft.USER.SKILLS)
        expect(response.foot).toBe('R')
        expect(response.weight).toBe('80')
        expect(response.height).toBe('170')
      }

      done()
    })
  }, 60000)

  test('Evaluar respuesta: Usuario (matias.barrientos@arzov.com)', (done) => {
    params.Payload = JSON.stringify(event03)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(200)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.email).toBe('matias.barrientos@arzov.com')
        expect(response.geohash).toBe('66jcfp')
        expect(JSON.parse(response.coords).LON.N).toBe('-70.573615')
        expect(JSON.parse(response.coords).LAT.N).toBe('-33.399435')
        expect(response.ageMinFilter).toBe('20')
        expect(response.ageMaxFilter).toBe('35')
        expect(response.matchFilter).toStrictEqual(['7v7'])
        expect(response.genderFilter).toStrictEqual(['M'])
        expect(response.positions).toStrictEqual(['GK', 'LW', 'RW'])
        expect(JSON.parse(response.skills)).toStrictEqual(umtEnvs.dft.USER.SKILLS)
        expect(response.foot).toBe('R')
        expect(response.weight).toBe('65')
        expect(response.height).toBe('175')
      }

      done()
    })
  }, 60000)

  test('Evaluar respuesta: Usuario (svonko.vescovi@arzov.com)', (done) => {
    params.Payload = JSON.stringify(event04)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(200)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.email).toBe('svonko.vescovi@arzov.com')
        expect(response.geohash).toBe('66jcfp')
        expect(JSON.parse(response.coords).LON.N).toBe('-70.573615')
        expect(JSON.parse(response.coords).LAT.N).toBe('-33.399435')
        expect(response.ageMinFilter).toBe('20')
        expect(response.ageMaxFilter).toBe('35')
        expect(response.matchFilter).toStrictEqual(['7v7'])
        expect(response.genderFilter).toStrictEqual(['M'])
        expect(response.positions).toStrictEqual(['CF', 'LW', 'RW'])
        expect(JSON.parse(response.skills)).toStrictEqual(umtEnvs.dft.USER.SKILLS)
        expect(response.foot).toBe('R')
        expect(response.weight).toBe('80')
        expect(response.height).toBe('170')
      }

      done()
    })
  }, 60000)

  test('Evaluar respuesta: Usuario (diego.lagos@arzov.com)', (done) => {
    params.Payload = JSON.stringify(event05)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(200)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.email).toBe('diego.lagos@arzov.com')
        expect(response.geohash).toBe('66jcfp')
        expect(JSON.parse(response.coords).LON.N).toBe('-70.573615')
        expect(JSON.parse(response.coords).LAT.N).toBe('-33.399435')
        expect(response.ageMinFilter).toBe('20')
        expect(response.ageMaxFilter).toBe('40')
        expect(response.matchFilter).toStrictEqual(['5v5', '7v7'])
        expect(response.genderFilter).toStrictEqual(['M'])
        expect(response.positions).toStrictEqual([''])
        expect(JSON.parse(response.skills)).toStrictEqual(umtEnvs.dft.USER.SKILLS)
        expect(response.foot).toBe('R')
        expect(response.weight).toBe('75')
        expect(response.height).toBe('180')
      }

      done()
    })
  }, 60000)

  test('Evaluar respuesta: Usuario (ivo.farias@arzov.com)', (done) => {
    params.Payload = JSON.stringify(event06)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(200)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.email).toBe('ivo.farias@arzov.com')
        expect(response.geohash).toBe('66jcfp')
        expect(JSON.parse(response.coords).LON.N).toBe('-70.573615')
        expect(JSON.parse(response.coords).LAT.N).toBe('-33.399435')
        expect(response.ageMinFilter).toBe('20')
        expect(response.ageMaxFilter).toBe('40')
        expect(response.matchFilter).toStrictEqual(['5v5', '7v7'])
        expect(response.genderFilter).toStrictEqual(['M'])
        expect(response.positions).toStrictEqual([''])
        expect(JSON.parse(response.skills)).toStrictEqual(umtEnvs.dft.USER.SKILLS)
        expect(response.foot).toBe('L')
        expect(response.weight).toBe('83')
        expect(response.height).toBe('172')
      }

      done()
    })
  }, 60000)
})