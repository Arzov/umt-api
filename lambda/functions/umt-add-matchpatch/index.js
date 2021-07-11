/**
 * Add a patch into the match
 * @author Franco Barrientos <franco.barrientos@arzov.com>
 */


// packages

const umtEnvs = require('umt-envs');
const aws = require('aws-sdk');
const dql = require('utils/dql');
const fns = require('utils/fns');


// configurations

let optionsDynamodb = umtEnvs.gbl.DYNAMODB_CONFIG;
let optionsLambda = umtEnvs.gbl.LAMBDA_CONFIG;

if (process.env.RUN_MODE === 'LOCAL') {
    optionsDynamodb = umtEnvs.dev.DYNAMODB_CONFIG;
    optionsLambda = umtEnvs.dev.LAMBDA_CONFIG;
}

const dynamodb = new aws.DynamoDB(optionsDynamodb);
const lambda = new aws.Lambda(optionsLambda);


// execution

exports.handler = async (event) => {

    const hashKey = `${umtEnvs.pfx.MATCH}${event.teamId1}#${event.teamId2}`;
    const rangeKey = `${umtEnvs.pfx.MATCH_PATCH}${event.email}`;
    const joinedOn = new Date().toISOString();
    const reqStat = JSON.parse(event.reqStat);
    const expireOn = event.expireOn;
    const GSI1PK = `${umtEnvs.pfx.USER}${event.email}`;
    const name = event.name;


    let err = new Error(JSON.stringify({
        code    : 'MatchPatchExistException',
        message : `El jugador ya participa del partido.`,
    })); // default case of player already in the match


    // validate if the match still exist

    let match = await fns.getMatch(lambda, event.teamId1, event.teamId2);

    if (!match.isEmpty) match.patches = JSON.parse(match.patches);
    else {

        // the match could be expired

        err = new Error(JSON.stringify({
            code    : 'MatchExpiredException',
            message : `El partido ya no existe o expiró.`,
        }));

        throw err;

    }


    // validate if the player belong to one of the team in the match

    const belongToTeam1 = await fns.belongToTeam(
        lambda,
        event.teamId1,
        event.email
    );

    const belongToTeam2 = await fns.belongToTeam(
        lambda,
        event.teamId2,
        event.email
    );

    if (belongToTeam1 || belongToTeam2) throw err;


    // validate if the player already has a request in the match

    let existRequest = await fns.getMatchPatch(
        lambda,
        event.teamId1,
        event.teamId2,
        event.email
    );

    if (!existRequest.isEmpty)
        existRequest.reqStat = JSON.parse(existRequest.reqStat);


    // request from match to player

    if (reqStat.PR.S === 'P') {

        // exist a request from the match

        if (!existRequest.isEmpty) {

            // player doesn't accept request from match yet

            if (existRequest.reqStat.PR.S == 'P')
                err = new Error(JSON.stringify({
                    code    : 'MatchPatchRequestException',
                    message : `Ya existe una solicitud para el jugador.`,
                }));

            throw err;

        }

        // add a new request to the player

        else
            return await dql.addMatchPatch(
                dynamodb,
                process.env.DB_UMT_001,
                hashKey,
                rangeKey,
                joinedOn,
                reqStat,
                expireOn,
                GSI1PK,
                name
            );

    }


    // request from player to match

    else {

        match.patches.CP.N = Number(match.patches.CP.N);
        match.patches.NP.N = Number(match.patches.NP.N);

        // player already has a request (pending or accepted)

        if (!existRequest.isEmpty) {

            /**
             * Increse the number of patches. This condition
             * `existRequest.PR.S == 'P'` means that the
             * player is accepting the request from the match.
             * So in this case we need to increase the number
             * of patches as well (CP and NP).
             */

            if (existRequest.reqStat.PR.S == 'P') {

                match.patches.CP.N += 1;
                match.patches.NP.N += 1;

                await fns.updateMatch(lambda, match);

                return await dql.addMatchPatch(
                    dynamodb,
                    process.env.DB_UMT_001,
                    hashKey,
                    rangeKey,
                    joinedOn,
                    reqStat,
                    expireOn,
                    GSI1PK,
                    name
                );

            }

            // player already in the match

            else throw err;

        }

        // check if the patches vacancy are not full

        else if (match.patches.CP.N >= match.patches.NP.N) {

            err = new Error(JSON.stringify({
                code    : 'MatchPatchFullException',
                message : `No quedan cupos en el partido.`,
            }));

            throw err;

        }

        // add new player into the match

        else {

            match.patches.CP.N += 1;

            await fns.updateMatch(lambda, match);

            return await dql.addMatchPatch(
                dynamodb,
                process.env.DB_UMT_001,
                hashKey,
                rangeKey,
                joinedOn,
                reqStat,
                expireOn,
                GSI1PK,
                name
            );

        }

    }

};
