import { Server, Request, ResponseToolkit } from '@hapi/hapi';
import { addUser, updateUser, updateStatusUser } from '../models/users';

export const users = (server: Server) => {

    // Welcome Message
    server.route({
        method: 'GET',
        path: '/',
        handler: (_request: Request, _h: ResponseToolkit) => {
            return 'Welcome to "GreenRun - Sports" API';
        }
    });

    // Insert a new user
    server.route({
        method: 'POST',
        path: '/users',
        handler: (request: Request, h: ResponseToolkit) => {
            const user = request.payload; // { users table columns: except id, update_at and delete_at }
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

    // Update a user
    server.route({
        method: 'PUT',
        path: '/users/{id}',
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