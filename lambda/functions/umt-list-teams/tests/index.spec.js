const aws = require('aws-sdk')
const umtEnvs = require('../../../layers/umt-envs/nodejs/node_modules/umt-envs')
const event = require('../events/event.json')

describe('Test AWS Lambda: umt-list-teams', () => {

  let lambda = new aws.Lambda(umtEnvs.dev.LAMBDA_CONFIG)
  let params = {FunctionName: 'umt-list-teams'}

  test('Evaluar respuesta: Usuario (franco.barrientos@arzov.com)', (done) => {
    params.Payload = JSON.stringify(event)

    lambda.invoke(params, function(err, data) {
      if (err) {
        console.log(err)
        expect(err.StatusCode).toBe(200)
      } else {
        let response = JSON.parse(data.Payload)

        expect(data.StatusCode).toBe(200)
        expect(response.items[0].id).toBe('man.united')
        expect(response.items[0].name).toBe('MAN. UNITED')
        expect(response.items[0].picture).toBe('')
        expect(JSON.parse(response.items[0].formation)).toStrictEqual(umtEnvs.dft.TEAM.FORMATION)
        expect(response.items[0].geohash).toBe('66jcfp')
        expect(response.items[0].searchingPlayers).toBe(false)
        expect(response.nextToken).toBe(null)
      }

      done()
    })
  }, 60000)
})