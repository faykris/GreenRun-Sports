//import { Server } from "@hapi/hapi";
import { users } from "./routes/users";
import { transactions } from "./routes/transactions";
import { bets } from "./routes/bets";
//const Jwt = require('@hapi/jwt');
//import {ResponseToolkit} from "@hapi/hapi";
const Hapi = require('@hapi/hapi')

const jwt = require('hapi-auth-jwt2');


const validate = async (decoded: any) => {
    return { decoded, isValid: true }
}

export const init = async () => {
    const server = new Hapi.server(
        { port: process.env.PORT || 3000 }
    );

    await server.register(jwt);
    server.auth.strategy('jwt', 'jwt', {
        complete: true,
        headerKey: 'authorization',
        tokenType: 'Bearer',
        key: process.env.P_KEY,
        //     jwksRsa.hapiJwt2Key({
        //     cache: true,
        //     rateLimit: true,
        //     jwksRequestsPerMinute: 5,
        //     jwksUri: 'https://[my.Auth0.details]/.well-known/jwks.json'
        // }),
        // Your own logic to validate the user.
        validate,
        verifyOptions: {
            // audience: 'https://[my.Auth0.details]',
            // issuer: 'https://[my.Auth0.details]/',
            algorithms: ['HS512'] //  RS256
        }
    })
    server.auth.default('jwt')

    users(server);
    transactions(server);
    bets(server);

    await server.start()
    return server;
}

process.on('unhandledRejection', err => {
    console.log(err);
    process.exit(1);
});

// users(server);
// transactions(server);
// bets(server);