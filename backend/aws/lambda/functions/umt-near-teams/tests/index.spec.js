const aws = require('aws-sdk')
const umtEnvs = require('../../../layers/umt-envs/nodejs/node_modules/umt-envs')
const event01 = require('../events/event01.json')
const event02 = require('../events/event02.json')
const event03 = require('../events/event03.json')

describe('Test AWS Lambda: umt-near-teams', () => {

  let lambda = new aws.Lambda(umtEnvs.dev.LAMBDA_CONFIG)
  let params = {FunctionName: 'umt-near-teams'}

  test('Evaluar respuesta: Parte 1 geohash - 66jcfp', (done) => {

    params.Payload = JSON.stringify(event01)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(400)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.nextToken).toStrictEqual("{\"rangeKey\":{\"S\":\"TEAM#fcbarcelona\"},\"hashKey\":{\"S\":\"TEAM#fcbarcelona\"},\"geohash\":{\"S\":\"66jcfp\"}}") 
      }

      done()
    })
  }, 60000)

  test('Evaluar respuesta: Parte 2 geohash - 66jcfp', (done) => {

    params.Payload = JSON.stringify(event02)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(400)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.items[0].geohash).toBe('66jcfp')
        expect(response.items[0].name).toBe('MAN. UNITED')
        expect(response.items[0].searchingPlayers).toBe(false)
        expect(response.items[0].formation).toStrictEqual({
          '5v5': {S: '2-1-1'}, '7v7': {S: '3-2-1'}, '11v11': {S: '4-4-2'}})
        expect(response.items[0].picture).toBe('')
        expect(response.items[0].id).toBe('man.united')
        expect(response.nextToken).toStrictEqual("{\"rangeKey\":{\"S\":\"TEAM#man.united\"},\"hashKey\":{\"S\":\"TEAM#man.united\"},\"geohash\":{\"S\":\"66jcfp\"}}") 
      }

      done()
    })
  }, 60000)

  test('Evaluar respuesta: Buscar equipos para unirse', (done) => {

    params.Payload = JSON.stringify(event03)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(400)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.items[0].geohash).toBe('66jcfp')
        expect(response.items[0].name).toBe('FC BARCELONA')
        expect(response.items[0].searchingPlayers).toBe(true)
        expect(response.items[0].formation).toStrictEqual({
          '5v5': {S: '2-1-1'}, '7v7': {S: '3-2-1'}, '11v11': {S: '4-4-2'}})
        expect(response.items[0].picture).toBe('')
        expect(response.items[0].id).toBe('fcbarcelona')
        expect(response.nextToken).toStrictEqual("{\"rangeKey\":{\"S\":\"TEAM#fcbarcelona\"},\"hashKey\":{\"S\":\"TEAM#fcbarcelona\"},\"geohash\":{\"S\":\"66jcfp\"}}") 
      }

      done()
    })
  }, 60000)

})