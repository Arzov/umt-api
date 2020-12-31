const aws = require('aws-sdk')
const umtEnvs = require('../../../layers/umt-envs/nodejs/node_modules/umt-envs')
const event01 = require('../events/event01.json')
const event02 = require('../events/event02.json')
const event03 = require('../events/event03.json')
const event04 = require('../events/event04.json')
const event05 = require('../events/event05.json')

describe('Test AWS Lambda: umt-near-matches', () => {

  let lambda = new aws.Lambda(umtEnvs.dev.LAMBDA_CONFIG)
  let params = {FunctionName: 'umt-near-matches'}

  test('Evaluar respuesta: Parte 1 geohash - 66jcfp', (done) => {
    params.Payload = JSON.stringify(event01)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(400)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.nextToken).toStrictEqual('{"rangeKey":{"S":"MATCH#man.united"},"hashKey":{"S":"MATCH#bayern"},"geohash":{"S":"66jcfp"}}') 
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
        expect(response.nextToken).toStrictEqual('{"rangeKey":{"S":"MATCH#man.united"},"hashKey":{"S":"MATCH#chelsea"},"geohash":{"S":"66jcfp"}}') 
      }

      done()
    })
  }, 60000)

  test('Evaluar respuesta: Parte 3 geohash - 66jcfp', (done) => {
    params.Payload = JSON.stringify(event03)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(400)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.items[0].teamId1).toBe('bayern')
        expect(response.items[0].teamId2).toBe('psg')
        expect(response.items[0].allowedPatches).toBe('3')
        expect(response.items[0].matchTypes).toStrictEqual(['7v7'])
        expect(response.items[0].positions).toStrictEqual([''])
        expect(response.items[0].stadiumGeohash).toBe('')
        expect(response.items[0].stadiumId).toBe('')
        expect(response.items[0].geohash).toBe('66jcfp')
        expect(JSON.parse(response.items[0].reqStat)).toStrictEqual({AR: {S: 'A'}, RR: {S: 'A'}})
        expect(response.items[0].courtId).toBe('0')
        expect(response.items[0].genderFilter).toStrictEqual(['M'])
        expect(response.nextToken).toStrictEqual("{\"rangeKey\":{\"S\":\"MATCH#psg\"},\"hashKey\":{\"S\":\"MATCH#bayern\"},\"geohash\":{\"S\":\"66jcfp\"}}") 
      }

      done()
    })
  }, 60000)

  test('Evaluar respuesta: Parte 4 geohash - 66jcfp', (done) => {
    params.Payload = JSON.stringify(event04)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(400)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.nextToken).toStrictEqual("{\"rangeKey\":{\"S\":\"MATCH#man.united\"},\"hashKey\":{\"S\":\"MATCH#bayern\"},\"geohash\":{\"S\":\"66jcfp\"}}") 
      }

      done()
    })
  }, 60000)

  test('Evaluar respuesta: Parte 5 geohash - 66jcfp', (done) => {
    params.Payload = JSON.stringify(event05)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(400)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.items[0].teamId1).toBe('chelsea')
        expect(response.items[0].teamId2).toBe('man.united')
        expect(response.items[0].allowedPatches).toBe('2')
        expect(response.items[0].matchTypes).toStrictEqual(['7v7'])
        expect(response.items[0].positions).toStrictEqual([''])
        expect(response.items[0].stadiumGeohash).toBe('')
        expect(response.items[0].stadiumId).toBe('')
        expect(response.items[0].geohash).toBe('66jcfp')
        expect(JSON.parse(response.items[0].reqStat)).toStrictEqual({AR: {S: 'A'}, RR: {S: 'A'}})
        expect(response.items[0].courtId).toBe('0')
        expect(response.items[0].genderFilter).toStrictEqual(['M'])
        expect(response.nextToken).toStrictEqual("{\"rangeKey\":{\"S\":\"MATCH#man.united\"},\"hashKey\":{\"S\":\"MATCH#chelsea\"},\"geohash\":{\"S\":\"66jcfp\"}}") 
      }

      done()
    })
  }, 60000)
})