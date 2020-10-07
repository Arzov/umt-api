const aws = require('aws-sdk')
const event01 = require('../events/event01.json')
const event02 = require('../events/event02.json')

describe('Test AWS Lambda: umt-near-teams', () => {

  let lambda = new aws.Lambda({
    apiVersion: '2015-03-31',
    region: 'us-east-1',
    endpoint: 'http://127.0.0.1:3001',
    sslEnabled: false
  })

  let params = {
    FunctionName: 'umt-near-teams'
  }

  test('Evaluar respuesta: Parte 1 geohash - 66jcfp', (done) => {

    params.Payload = JSON.stringify(event01)

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
          '5v5': '2-1-1', '7v7': '3-2-1', '11v11': '4-4-2'})
        expect(response.items[0].picture).toBe('')
        expect(response.items[0].id).toBe('man.united')
        expect(response.nextToken).toStrictEqual("{\"rangeKey\":{\"S\":\"TEAM#man.united\"},\"hashKey\":{\"S\":\"TEAM#man.united\"},\"geohash\":{\"S\":\"66jcfp\"}}") 
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
        expect(response.items[0].name).toBe('RPC')
        expect(response.items[0].searchingPlayers).toBe(false)
        expect(response.items[0].formation).toStrictEqual({
          '5v5': '2-1-1', '7v7': '3-2-1', '11v11': '4-4-2'})
        expect(response.items[0].picture).toBe('')
        expect(response.items[0].id).toBe('rpc')
        expect(response.nextToken).toStrictEqual("{\"rangeKey\":{\"S\":\"TEAM#rpc\"},\"hashKey\":{\"S\":\"TEAM#rpc\"},\"geohash\":{\"S\":\"66jcfp\"}}") 
      }

      done()
    })
  }, 60000)

})