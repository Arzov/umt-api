const aws = require('aws-sdk')
const umtEnvs = require('../../../layers/umt-envs/nodejs/node_modules/umt-envs')
const event01 = require('../events/event01.json')
const event02 = require('../events/event02.json')

describe('Test AWS Lambda: umt-near-teams', () => {

  let lambda = new aws.Lambda(umtEnvs.dev.LAMBDA_CONFIG)
  let params = {FunctionName: 'umt-near-teams'}

  test('Evaluar respuesta: Geohash - 66jcfp', (done) => {
    params.Payload = JSON.stringify(event01)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(400)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.items[0].geohash).toBe('66jcfp')
        expect(response.items[0].name).toBe('BAYERN')
        expect(response.items[0].searchingPlayers).toBe(true)
        expect(JSON.parse(response.items[0].formation)).toStrictEqual(umtEnvs.dft.TEAM.FORMATION)
        expect(response.items[0].picture).toBe('')
        expect(response.items[0].id).toBe('bayern')
        expect(response.nextToken).toStrictEqual("{\"rangeKey\":{\"S\":\"TEAM#bayern\"},\"hashKey\":{\"S\":\"TEAM#bayern\"},\"geohash\":{\"S\":\"66jcfp\"}}") 
      }

      done()
    })
  }, 60000)

  test('Evaluar respuesta: Buscar equipos para unirse', (done) => {
    params.Payload = JSON.stringify(event02)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(400)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.items[0].geohash).toBe('66jcfp')
        expect(response.items[0].name).toBe('BAYERN')
        expect(response.items[0].searchingPlayers).toBe(true)
        expect(JSON.parse(response.items[0].formation)).toStrictEqual(umtEnvs.dft.TEAM.FORMATION)
        expect(response.items[0].picture).toBe('')
        expect(response.items[0].id).toBe('bayern')
        expect(response.nextToken).toStrictEqual("{\"rangeKey\":{\"S\":\"TEAM#bayern\"},\"hashKey\":{\"S\":\"TEAM#bayern\"},\"geohash\":{\"S\":\"66jcfp\"}}") 
      }

      done()
    })
  }, 60000)
})