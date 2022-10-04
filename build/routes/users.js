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
exports.users = void 0;
const users_1 = require("../models/users");
const Jwt = require('@hapi/jwt');
// const verifyToken = (artifact: object, secret: string, options = {}) => {
//     try {
//         Jwt.token.verify(artifact, secret, options);
//         return { isValid: true };
//     }
//     catch (err) {
//         return {
//             isValid: false,
//             // @ts-ignore
//             error: err.message
//         };
//     }
// };
const users = (server) => {
    // Welcome Message
    server.route({
        method: 'GET',
        path: '/',
        // @ts-ignore
        config: {
            auth: false
        },
        handler: (_request, _h) => {
            return 'Welcome to "GreenRun - Sports" API';
        }
    });
    server.route({
        method: 'GET',
        path: '/restricted',
        // @ts-ignore
        config: {
            auth: 'jwt'
        },
        handler: (request, h) => {
            console.log(request.auth.credentials);
            const response = h.response({ text: 'You used a token' });
            response.header('Authorization', request.headers.authorization);
            return response;
        }
    });
    server.route({
        method: 'POST',
        path: '/login',
        // @ts-ignore
        config: {
            auth: false
        },
        handler: (request, h) => __awaiter(void 0, void 0, void 0, function* () {
            const credentials = request.payload; // { user, password }
            const token = Jwt.token.generate(credentials, {
                key: process.env.P_KEY,
                algorithm: 'HS512'
            }, {
                ttlSec: 14400 // 4 hours
            });
            console.log('token:', token);
            return h.response({ message: "Logged in successfully", accessToken: token }).code(200);
        })
    });
    // provisional endpoint - it will be removed
    // Insert a new user
    server.route({
        method: 'POST',
        path: '/users',
        // @ts-ignore
        config: {
            auth: false
        },
        handler: (request, h) => {
            const user = request.payload; // { users table columns: except id, update_at and delete_at }
            return (0, users_1.addUser)(user)
                .then((response) => {
                // @ts-ignore
                return h.response(response).code(response.statusCode);
            })
                .catch((e) => {
                console.log(e);
                return e.response;
            });
        }
    });
    // Update a user
    server.route({
        method: 'PUT',
        path: '/users/{id}',
        // @ts-ignore
        config: {
            auth: 'jwt'
        },
        handler: (request, h) => {
            const id = request.params.id;
            const user = request.payload; // { users table columns: except id and state }
            return (0, users_1.updateUser)(id, user)
                .then((response) => {
                // @ts-ignore
                return h.response(response).code(response.statusCode);
            })
                .catch((e) => {
                console.log(e);
                return e.response;
            });
        }
    });
    // ADMIN - Update state of a user
    server.route({
        method: 'PUT',
        path: '/users/state/{id}',
        // @ts-ignore
        config: {
            auth: 'jwt'
        },
        handler: (request, h) => {
            const id = request.params.id;
            const body = request.payload;
            return (0, users_1.updateStatusUser)(id, body) // { state: active || blocked }
                .then((response) => {
                // @ts-ignore
                return h.response(response).code(response.statusCode);
            })
                .catch((e) => {
                console.log(e);
                return e.response;
            });
        }
    });
};
exports.users = users;
