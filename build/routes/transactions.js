"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactions = void 0;
const transactions_1 = require("../models/transactions");
const transactions = (server) => {
    server.route({
        method: 'POST',
        path: '/transactions/deposit/user/{id}',
        handler: (request, h) => {
            const id = request.params.id;
            const user = request.payload;
            return (0, transactions_1.addUserDepot)(id, user)
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
        path: '/transactions/withdraw/user/{id}',
        handler: (request, h) => {
            const id = request.params.id;
            const user = request.payload;
            return (0, transactions_1.addUserWithdraw)(id, user)
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
        method: 'GET',
        path: '/transactions/balance/user/{id}',
        handler: (request, h) => {
            const id = request.params.id;
            return (0, transactions_1.getTransactionBalance)(id)
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
        method: 'GET',
        path: '/transactions/{category}/{id}',
        handler: (request, h) => {
            const id = request.params.id;
            const category = request.params.category;
            return (0, transactions_1.getTranUserByCategory)(id, category)
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
    // ----- admin endpoints ------
    server.route({
        method: 'GET',
        path: '/transactions/user/{user_id}',
        handler: (request, h) => {
            const user_id = request.params.user_id;
            return (0, transactions_1.getUserTransactions)(user_id)
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
exports.transactions = transactions;
