"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
//import { Server } from "@hapi/hapi";
const users_1 = require("./routes/users");
const transactions_1 = require("./routes/transactions");
const bets_1 = require("./routes/bets");
//const Jwt = require('@hapi/jwt');
//import {ResponseToolkit} from "@hapi/hapi";
const Hapi = require('@hapi/hapi');
const jwt = require('hapi-auth-jwt2');
const validate = (decoded) => __awaiter(void 0, void 0, void 0, function* () {
    return { decoded, isValid: true };
});
const init = () => __awaiter(void 0, void 0, void 0, function* () {
    const server = new Hapi.server({ port: process.env.PORT || 3000 });
    yield server.register(jwt);
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
    });
    server.auth.default('jwt');
    (0, users_1.users)(server);
    (0, transactions_1.transactions)(server);
    (0, bets_1.bets)(server);
    yield server.start();
    return server;
});
exports.init = init;
process.on('unhandledRejection', err => {
    console.log(err);
    process.exit(1);
});
// users(server);
// transactions(server);
// bets(server);
