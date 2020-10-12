const aws = require('aws-sdk')
const umtEnvs = require('../../../layers/umt-envs/nodejs/node_modules/umt-envs')
const event01 = require('../events/event01.json')

describe('Test AWS Lambda: umt-add-stadium', () => {

  let lambda = new aws.Lambda(umtEnvs.dev.LAMBDA_CONFIG)
  let params = {FunctionName: 'umt-add-stadium'}

  test('Evaluar respuesta: Club (CLUB DEPORTIVO INDEPE)', (done) => {
    params.Payload = JSON.stringify(event01)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(200)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.geohash).toBe('66jcfp')
        expect(response.id).toBe('clubdeportivoindepe')
        expect(response.name).toBe('CLUB DEPORTIVO INDEPE')
        expect(response.matchTypes).toStrictEqual(['5v5', '7v7', '11v11'])
        expect(response.coords).toStrictEqual({LON: {N: '-70.573615'}, LAT: {N: '-33.399435'}})
        expect(response.address).toBe('')
      }

      done()
    })
  }, 60000)
})