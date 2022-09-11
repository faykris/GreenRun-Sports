import { Server, Request, ResponseToolkit } from '@hapi/hapi';
import {addBetUser, addUser, updateUser, updateStatusUser} from '../models/users';

export const users = (server: Server) => {

    server.route({
        method: 'POST',
        path: '/users',
        handler: (request: Request, _h: ResponseToolkit) => {
            const user = request.payload;
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

    server.route({
        method: 'PUT',
        path: '/users/{id}',
        handler: (request: Request, h: ResponseToolkit) => {
            const id = request.params.id;
            const user = request.payload;
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

    server.route({
        method: 'POST',
        path: '/transactions/bet/user/{user_id}/event/{event_id}',
        handler: (request: Request, h: ResponseToolkit) => {
            const user_id = request.params.user_id;
            const event_id = request.params.event_id;
            const body = request.payload; // body: {amount, option, bet_id}
            return addBetUser(user_id, event_id, body)
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
    //admin endpoint
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