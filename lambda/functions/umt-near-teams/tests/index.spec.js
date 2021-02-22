const aws = require('aws-sdk')
const umtEnvs = require('../../../layers/umt-envs/nodejs/node_modules/umt-envs')
const events = require('../events/events.json')

describe('Test AWS Lambda: umt-near-teams', () => {

  let lambda = new aws.Lambda(umtEnvs.dev.LAMBDA_CONFIG)
  let params = {FunctionName: 'umt-near-teams'}

  test('Evaluar respuesta: Buscar rivales 01', (done) => {
    params.Payload = JSON.stringify(events[0])

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(400)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.items[0].id).toBe('chelsea')
        expect(response.items[1].id).toBe('fcbarcelona')
        expect(response.items[2].id).toBe('man.united')
        expect(response.items[0].geohash).toBe('66jcfp')
        expect(response.items[0].name).toBe('CHELSEA')
        expect(response.items[0].ageMinFilter).toBe('20')
        expect(response.items[0].ageMaxFilter).toBe('40')
        expect(response.items[0].genderFilter).toStrictEqual(['M'])
        expect(response.items[0].matchFilter).toStrictEqual(['7v7'])
        expect(response.items[0].searchingPlayers).toBe(true)
        expect(JSON.parse(response.items[0].formation)).toStrictEqual(umtEnvs.dft.TEAM.FORMATION)
        expect(response.items[0].picture).toBe('')
        expect(response.nextToken).toStrictEqual("{\"rangeKey\":{\"S\":\"TEAM#psg\"},\"hashKey\":{\"S\":\"TEAM#psg\"},\"geohash\":{\"S\":\"66jcfp\"}}") 
      }

      done()
    })
  }, 60000)

  test('Evaluar respuesta: Unirse a equipo 02', (done) => {
    params.Payload = JSON.stringify(events[1])

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(400)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.items[0].id).toBe('bayern')
        expect(response.items[1].id).toBe('chelsea')
        expect(response.items[0].geohash).toBe('66jcfp')
        expect(response.items[0].name).toBe('BAYERN')
        expect(response.items[0].ageMinFilter).toBe('20')
        expect(response.items[0].ageMaxFilter).toBe('40')
        expect(response.items[0].genderFilter).toStrictEqual(['F', 'M'])
        expect(response.items[0].matchFilter).toStrictEqual(['7v7'])
        expect(response.items[0].searchingPlayers).toBe(true)
        expect(JSON.parse(response.items[0].formation)).toStrictEqual(umtEnvs.dft.TEAM.FORMATION)
        expect(response.items[0].picture).toBe('')
        expect(response.nextToken).toStrictEqual("{\"rangeKey\":{\"S\":\"TEAM#psg\"},\"hashKey\":{\"S\":\"TEAM#psg\"},\"geohash\":{\"S\":\"66jcfp\"}}") 
      }

      done()
    })
  }, 60000)

  test('Evaluar respuesta: Unirse a equipo 03', (done) => {
    params.Payload = JSON.stringify(events[2])

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(400)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.items[0].id).toBe('bayern')
        expect(response.items[1].id).toBe('psg')
        expect(response.items[0].geohash).toBe('66jcfp')
        expect(response.items[0].name).toBe('BAYERN')
        expect(response.items[0].ageMinFilter).toBe('20')
        expect(response.items[0].ageMaxFilter).toBe('40')
        expect(response.items[0].genderFilter).toStrictEqual(['F', 'M'])
        expect(response.items[0].matchFilter).toStrictEqual(['7v7'])
        expect(response.items[0].searchingPlayers).toBe(true)
        expect(JSON.parse(response.items[0].formation)).toStrictEqual(umtEnvs.dft.TEAM.FORMATION)
        expect(response.items[0].picture).toBe('')
        expect(response.nextToken).toStrictEqual("{\"rangeKey\":{\"S\":\"TEAM#psg\"},\"hashKey\":{\"S\":\"TEAM#psg\"},\"geohash\":{\"S\":\"66jcfp\"}}") 
      }

      done()
    })
  }, 60000)

  test('Evaluar respuesta: Buscar rivales 04', (done) => {
    params.Payload = JSON.stringify(events[3])

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(400)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.items[0].id).toBe('psg')
        expect(response.items[0].geohash).toBe('66jcfp')
        expect(response.items[0].name).toBe('PSG')
        expect(response.items[0].ageMinFilter).toBe('20')
        expect(response.items[0].ageMaxFilter).toBe('40')
        expect(response.items[0].genderFilter).toStrictEqual(['F'])
        expect(response.items[0].matchFilter).toStrictEqual(['7v7'])
        expect(response.items[0].searchingPlayers).toBe(true)
        expect(JSON.parse(response.items[0].formation)).toStrictEqual(umtEnvs.dft.TEAM.FORMATION)
        expect(response.items[0].picture).toBe('')
        expect(response.nextToken).toStrictEqual("{\"rangeKey\":{\"S\":\"TEAM#psg\"},\"hashKey\":{\"S\":\"TEAM#psg\"},\"geohash\":{\"S\":\"66jcfp\"}}") 
      }

      done()
    })
  }, 60000)

  test('Evaluar respuesta: Buscar rivales 05', (done) => {
    params.Payload = JSON.stringify(events[4])

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(400)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.items[0].id).toBe('man.united')
        expect(response.items[0].geohash).toBe('66jcfp')
        expect(response.items[0].name).toBe('MAN. UNITED')
        expect(response.items[0].ageMinFilter).toBe('20')
        expect(response.items[0].ageMaxFilter).toBe('40')
        expect(response.items[0].genderFilter).toStrictEqual(['M'])
        expect(response.items[0].matchFilter).toStrictEqual(['11v11', '5v5'])
        expect(response.items[0].searchingPlayers).toBe(false)
        expect(JSON.parse(response.items[0].formation)).toStrictEqual(umtEnvs.dft.TEAM.FORMATION)
        expect(response.items[0].picture).toBe('')
        expect(response.nextToken).toStrictEqual("{\"rangeKey\":{\"S\":\"TEAM#psg\"},\"hashKey\":{\"S\":\"TEAM#psg\"},\"geohash\":{\"S\":\"66jcfp\"}}") 
      }

      done()
    })
  }, 60000)

  test('Evaluar respuesta: Buscar rivales 06', (done) => {
    params.Payload = JSON.stringify(events[5])

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(400)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.items[0].id).toBe('bayern')
        expect(response.items[0].geohash).toBe('66jcfp')
        expect(response.items[0].name).toBe('BAYERN')
        expect(response.items[0].ageMinFilter).toBe('20')
        expect(response.items[0].ageMaxFilter).toBe('40')
        expect(response.items[0].genderFilter).toStrictEqual(['F', 'M'])
        expect(response.items[0].matchFilter).toStrictEqual(['7v7'])
        expect(response.items[0].searchingPlayers).toBe(true)
        expect(JSON.parse(response.items[0].formation)).toStrictEqual(umtEnvs.dft.TEAM.FORMATION)
        expect(response.items[0].picture).toBe('')
        expect(response.nextToken).toStrictEqual("{\"rangeKey\":{\"S\":\"TEAM#psg\"},\"hashKey\":{\"S\":\"TEAM#psg\"},\"geohash\":{\"S\":\"66jcfp\"}}") 
      }

      done()
    })
  }, 60000)
})