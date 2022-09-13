"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactions = void 0;
const transactions_1 = require("../models/transactions");
const transactions = (server) => {
    // Insert a deposit transaction from user
    server.route({
        method: 'POST',
        path: '/transactions/deposit/user/{user_id}',
        handler: (request, h) => {
            const user_id = request.params.user_id;
            const user = request.payload; // body: { amount }
            return (0, transactions_1.addUserDepot)(user_id, user)
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
    // Insert a withdraw transaction from user
    server.route({
        method: 'POST',
        path: '/transactions/withdraw/user/{user_id}',
        handler: (request, h) => {
            const user_id = request.params.user_id;
            const user = request.payload; // body: { amount }
            return (0, transactions_1.addUserWithdraw)(user_id, user)
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
    // Insert a bet transaction by the user
    server.route({
        method: 'POST',
        path: '/transactions/bet/event/{event_id}/user/{user_id}',
        handler: (request, h) => {
            const user_id = request.params.user_id;
            const event_id = request.params.event_id;
            const body = request.payload; // body: {amount, option, bet_id}
            return (0, transactions_1.addBetUser)(user_id, event_id, body)
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
    // Get a user balance with ID
    server.route({
        method: 'GET',
        path: '/transactions/balance/user/{user_id}',
        handler: (request, h) => {
            const user_id = request.params.user_id;
            return (0, transactions_1.getTransactionBalance)(user_id)
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
    // Get transactions by category and ID
    server.route({
        method: 'GET',
        path: '/transactions/category/{category}/user/{user_id}',
        handler: (request, h) => {
            const user_id = request.params.user_id;
            const category = request.params.category;
            return (0, transactions_1.getTranUserByCategory)(user_id, category)
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
    // Get all transactions from a user
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
