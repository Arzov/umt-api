const aws = require('aws-sdk')
const umtEnvs = require('../../../layers/umt-envs/nodejs/node_modules/umt-envs')
const event = require('../events/event.json')

describe('Test AWS Lambda: umt-get-team', () => {

  let lambda = new aws.Lambda(umtEnvs.dev.LAMBDA_CONFIG)
  let params = {FunctionName: 'umt-get-team'}

  test('Respuesta desde AWS: Equipo MAN. UNITED', (done) => {
    params.Payload = JSON.stringify(event)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(400)
      } else {
        let response = JSON.parse(data.Payload)
  
        expect(data.StatusCode).toBe(200)
        expect(response.id).toBe('man.united')
        expect(response.geohash).toBe('66jcfp')
        expect(response.name).toBe('MAN. UNITED')
        expect(response.picture).toBe(umtEnvs.dft.TEAM.PICTURE)
        expect(JSON.parse(response.formation)).toStrictEqual(umtEnvs.dft.TEAM.FORMATION)
        expect(response.searchingPlayers).toBe(false)
      }
  
      done()
    })
  }, 60000)
})