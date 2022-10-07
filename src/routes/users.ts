import { Server, Request, ResponseToolkit } from '@hapi/hapi';
import {addUser, updateUser, updateStatusUser, checkLoginFields} from '../models/users';
import { User } from "../models/users";
const Jwt = require('@hapi/jwt');


export const users = (server: Server) => {

    // Welcome Message
    server.route({
        method: 'GET',
        path: '/',
        // @ts-ignore
        config: {
            auth: false
        },
        handler: (_request: Request, _h: ResponseToolkit) => {
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
        handler: async (request: Request, h: ResponseToolkit) => {
            const credentials: User = { // { email or username, password }
                // @ts-ignore
                ...request.payload
            };

            const loginValidate = await checkLoginFields(credentials);

            if (loginValidate.statusCode !== 200) {
                return h.response(loginValidate).code(loginValidate.statusCode);
            }

            const token = Jwt.token.generate(
                credentials,
                {
                    key: process.env.P_KEY,
                    algorithm: 'HS512'
                },
                {
                    ttlSec: 86400 // 24 hours
                }
            );
            //console.log('token:',token)
            return h.response({statusCode: 200, accessToken: token, message:"Logged in successfully"}).code(200);
        }
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
        handler: (request: Request, h: ResponseToolkit) => {

            const user: User = {
                // @ts-ignore
                ...request.payload
            }; // { users table columns: except id, update_at and delete_at }
            return addUser(user)
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
        handler: (request: Request, h: ResponseToolkit) => {
            const id = request.params.id;
            const user = request.payload; // { users table columns: except id and state }
            return updateUser(id, user)
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
        handler: (request: Request, h: ResponseToolkit) => {
            const id = request.params.id;
            const body = request.payload;
            return updateStatusUser(id, body) // { state: active || blocked }
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
}