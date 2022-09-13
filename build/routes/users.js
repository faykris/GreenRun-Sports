"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = void 0;
const users_1 = require("../models/users");
const users = (server) => {
    // Welcome Message
    server.route({
        method: 'GET',
        path: '/',
        handler: (_request, _h) => {
            return 'Welcome to "GreenRun - Sports" API';
        }
    });
    // Insert a new user
    server.route({
        method: 'POST',
        path: '/users',
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
