const aws = require('aws-sdk')
const event01 = require('../events/event01.json')
const event02 = require('../events/event02.json')

describe('Test AWS Lambda: umt-near-matches', () => {

  let lambda = new aws.Lambda({
    apiVersion: '2015-03-31',
    region: 'us-east-1',
    endpoint: 'http://127.0.0.1:3001',
    sslEnabled: false
  })

  let params = {
    FunctionName: 'umt-near-matches'
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
        expect(response.items[0].teamId1).toBe('man.united')
        expect(response.items[0].teamId2).toBe('fcbarcelona')
        expect(response.items[0].allowedPatches).toBe('2')
        expect(response.items[0].matchTypes).toStrictEqual(['7v7'])
        expect(response.items[0].positions).toStrictEqual([''])
        expect(response.items[0].stadiumGeohash).toBe('')
        expect(response.items[0].stadiumId).toBe('')
        expect(response.items[0].geohash).toBe('66jcfp')
        expect(response.items[0].status).toStrictEqual({AR: {S: 'P'}, RR: {S: 'P'}})
        expect(response.items[0].courtId).toBe('0')
        expect(response.nextToken).toStrictEqual("{\"rangeKey\":{\"S\":\"MATCH#fcbarcelona\"},\"hashKey\":{\"S\":\"MATCH#man.united\"},\"geohash\":{\"S\":\"66jcfp\"}}") 
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
        expect(response.nextToken).toStrictEqual("{\"rangeKey\":{\"S\":\"MATCH#man.united\"},\"hashKey\":{\"S\":\"MATCH#rpc\"},\"geohash\":{\"S\":\"66jcfp\"}}") 
      }

      done()
    })
  }, 60000)

})