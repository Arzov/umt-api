const aws = require('aws-sdk')
const event01 = require('../events/event01.json')
const event02 = require('../events/event02.json')

describe('Test AWS Lambda: umt-add-team', () => {

  let lambda = new aws.Lambda({
    apiVersion: '2015-03-31',
    region: 'us-east-1',
    endpoint: 'http://127.0.0.1:3001',
    sslEnabled: false
  })

  let params = {
    FunctionName: 'umt-add-team'
  }

  test('Evaluar respuesta: Equipo (RPC)', (done) => {
    params.Payload = JSON.stringify(event01)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(200)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.geohash).toBe('66jcfp')
        expect(response.id).toBe('rpc')
        expect(response.name).toBe('RPC')
        expect(response.picture).toBe('')
        expect(response.formation).toStrictEqual({ '5v5': { S: '2-1-1' }, '7v7': { S: '3-2-1' },
          '11v11': { S: '4-4-2' }})
        expect(response.searchingPlayers).toBe('false')
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
        expect(response.formation).toStrictEqual({ '5v5': { S: '2-1-1' }, '7v7': { S: '3-2-1' },
          '11v11': { S: '4-4-2' }})
        expect(response.searchingPlayers).toBe('false')
      }

      done()
    })
  }, 60000)
})