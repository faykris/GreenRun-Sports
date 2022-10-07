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
        method: 'POST',
        path: '/login',
        // @ts-ignore
        config: {
            auth: false
        },
        handler: (request, h) => __awaiter(void 0, void 0, void 0, function* () {
            const credentials = Object.assign({}, request.payload);
            const loginValidate = yield (0, users_1.checkLoginFields)(credentials);
            if (loginValidate.statusCode !== 200) {
                return h.response(loginValidate).code(loginValidate.statusCode);
            }
            const token = Jwt.token.generate(credentials, {
                key: process.env.P_KEY,
                algorithm: 'HS512'
            }, {
                ttlSec: 86400 // 24 hours
            });
            //console.log('token:',token)
            return h.response({ statusCode: 200, accessToken: token, message: "Logged in successfully" }).code(200);
        })
    });
    // provisional endpoint - it will be removed
    // Insert a new user
    server.route({
        method: 'POST',
        path: '/register',
        // @ts-ignore
        config: {
            auth: false
        },
        handler: (request, h) => {
            const user = Object.assign({}, request.payload); // { users table columns: except id, update_at and delete_at }
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
    // Update info from user
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
