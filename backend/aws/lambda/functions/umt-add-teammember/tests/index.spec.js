const aws = require('aws-sdk')
const umtEnvs = require('../../../layers/umt-envs/nodejs/node_modules/umt-envs')
const event01 = require('../events/event01.json')
const event02 = require('../events/event02.json')
const event03 = require('../events/event03.json')
const event04 = require('../events/event04.json')
const event05 = require('../events/event05.json')
const event06 = require('../events/event06.json')
const event07 = require('../events/event07.json')
const event08 = require('../events/event08.json')
const event09 = require('../events/event09.json')
const event10 = require('../events/event10.json')

describe('Test AWS Lambda: umt-add-teammember', () => {

  let lambda = new aws.Lambda(umtEnvs.dev.LAMBDA_CONFIG)
  let params = {FunctionName: 'umt-add-teammember'}

  test('Evaluar respuesta: Equipo - Miembro (MAN. UNITED - franco.barrientos@arzov.com)', (done) => {
    params.Payload = JSON.stringify(event01)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(200)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.teamId).toBe('man.united')
        expect(response.userEmail).toBe('franco.barrientos@arzov.com')
        expect(response.position).toStrictEqual(umtEnvs.dft.TEAMMEMBER.POSITION)
        expect(response.role).toStrictEqual(['Admin', 'Player', 'Captain'])
        expect(response.reqStat).toStrictEqual({TR: {S: 'A'}, PR: {S: 'A'}})
        expect(response.number).toBe('0')
      }

      done()
    })
  }, 60000)

  test('Evaluar respuesta: Equipo - Miembro (MAN. UNITED - jesus.barrientos@arzov.com)', (done) => {
    params.Payload = JSON.stringify(event02)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(200)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.teamId).toBe('man.united')
        expect(response.userEmail).toBe('jesus.barrientos@arzov.com')
        expect(response.position).toStrictEqual(umtEnvs.dft.TEAMMEMBER.POSITION)
        expect(response.role).toStrictEqual(['Player'])
        expect(response.reqStat).toStrictEqual({TR: {S: 'P'}, PR: {S: 'A'}})
        expect(response.number).toBe('0')
      }

      done()
    })
  }, 60000)

  test('Evaluar respuesta: Equipo - Miembro (MAN. UNITED - matias.barrientos@arzov.com)', (done) => {
    params.Payload = JSON.stringify(event03)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(200)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.teamId).toBe('man.united')
        expect(response.userEmail).toBe('matias.barrientos@arzov.com')
        expect(response.position).toStrictEqual(umtEnvs.dft.TEAMMEMBER.POSITION)
        expect(response.role).toStrictEqual(['Player'])
        expect(response.reqStat).toStrictEqual({TR: {S: 'A'}, PR: {S: 'P'}})
        expect(response.number).toBe('0')
      }

      done()
    })
  }, 60000)

  test('Evaluar respuesta: Equipo - Miembro (FC BARCELONA - jesus.barrientos@arzov.com)', (done) => {
    params.Payload = JSON.stringify(event04)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(200)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.teamId).toBe('fcbarcelona')
        expect(response.userEmail).toBe('jesus.barrientos@arzov.com')
        expect(response.position).toStrictEqual(umtEnvs.dft.TEAMMEMBER.POSITION)
        expect(response.role).toStrictEqual(['Admin', 'Player', 'Captain'])
        expect(response.reqStat).toStrictEqual({TR: {S: 'A'}, PR: {S: 'A'}})
        expect(response.number).toBe('0')
      }

      done()
    })
  }, 60000)

  test('Evaluar respuesta: Equipo - Miembro (FC BARCELONA - franco.barrientos@arzov.com)', (done) => {
    params.Payload = JSON.stringify(event05)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(200)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.teamId).toBe('fcbarcelona')
        expect(response.userEmail).toBe('franco.barrientos@arzov.com')
        expect(response.position).toStrictEqual(umtEnvs.dft.TEAMMEMBER.POSITION)
        expect(response.role).toStrictEqual(['Player'])
        expect(response.reqStat).toStrictEqual({TR: {S: 'A'}, PR: {S: 'P'}})
        expect(response.number).toBe('0')
      }

      done()
    })
  }, 60000)

  test('Evaluar respuesta: Equipo - Miembro (BAYERN - matias.barrientos@arzov.com)', (done) => {
    params.Payload = JSON.stringify(event06)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(200)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.teamId).toBe('bayern')
        expect(response.userEmail).toBe('matias.barrientos@arzov.com')
        expect(response.position).toStrictEqual(umtEnvs.dft.TEAMMEMBER.POSITION)
        expect(response.role).toStrictEqual(['Admin', 'Player', 'Captain'])
        expect(response.reqStat).toStrictEqual({TR: {S: 'A'}, PR: {S: 'A'}})
        expect(response.number).toBe('0')
      }

      done()
    })
  }, 60000)

  test('Evaluar respuesta: Equipo - Miembro (BAYERN - franco.barrientos@arzov.com)', (done) => {
    params.Payload = JSON.stringify(event07)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(200)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.teamId).toBe('bayern')
        expect(response.userEmail).toBe('franco.barrientos@arzov.com')
        expect(response.position).toStrictEqual(umtEnvs.dft.TEAMMEMBER.POSITION)
        expect(response.role).toStrictEqual(['Player'])
        expect(response.reqStat).toStrictEqual({TR: {S: 'P'}, PR: {S: 'A'}})
        expect(response.number).toBe('0')
      }

      done()
    })
  }, 60000)

  test('Evaluar respuesta: Equipo - Miembro (PSG - diego.lagos@arzov.com)', (done) => {
    params.Payload = JSON.stringify(event08)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(200)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.teamId).toBe('psg')
        expect(response.userEmail).toBe('diego.lagos@arzov.com')
        expect(response.position).toStrictEqual(umtEnvs.dft.TEAMMEMBER.POSITION)
        expect(response.role).toStrictEqual(['Admin', 'Player', 'Captain'])
        expect(response.reqStat).toStrictEqual({TR: {S: 'A'}, PR: {S: 'A'}})
        expect(response.number).toBe('0')
      }

      done()
    })
  }, 60000)

  test('Evaluar respuesta: Equipo - Miembro (REAL MADRID - ivo.farias@arzov.com)', (done) => {
    params.Payload = JSON.stringify(event09)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(200)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.teamId).toBe('realmadrid')
        expect(response.userEmail).toBe('ivo.farias@arzov.com')
        expect(response.position).toStrictEqual(umtEnvs.dft.TEAMMEMBER.POSITION)
        expect(response.role).toStrictEqual(['Admin', 'Player', 'Captain'])
        expect(response.reqStat).toStrictEqual({TR: {S: 'A'}, PR: {S: 'A'}})
        expect(response.number).toBe('0')
      }

      done()
    })
  }, 60000)

  test('Evaluar respuesta: Equipo - Miembro (CHELSEA - jesus.barrientos@arzov.com)', (done) => {
    params.Payload = JSON.stringify(event10)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(200)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.teamId).toBe('chelsea')
        expect(response.userEmail).toBe('jesus.barrientos@arzov.com')
        expect(response.position).toStrictEqual(umtEnvs.dft.TEAMMEMBER.POSITION)
        expect(response.role).toStrictEqual(['Admin', 'Player', 'Captain'])
        expect(response.reqStat).toStrictEqual({TR: {S: 'A'}, PR: {S: 'A'}})
        expect(response.number).toBe('0')
      }

      done()
    })
  }, 60000)
})