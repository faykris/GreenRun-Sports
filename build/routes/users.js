"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = void 0;
const users_1 = require("../models/users");
const users = (server) => {
    server.route({
        method: 'POST',
        path: '/users',
        handler: (request, _h) => {
            const user = request.payload;
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
    server.route({
        method: 'PUT',
        path: '/users/{id}',
        handler: (request, h) => {
            const id = request.params.id;
            const user = request.payload;
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
    server.route({
        method: 'POST',
        path: '/transactions/bet/user/{user_id}/event/{event_id}',
        handler: (request, h) => {
            const user_id = request.params.user_id;
            const event_id = request.params.event_id;
            const body = request.payload; // body: {amount, option, bet_id}
            return (0, users_1.addBetUser)(user_id, event_id, body)
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
