import { Server, Request, ResponseToolkit } from '@hapi/hapi';
import { addUserDepot, addUserWithdraw, addBetUser, getTransactionBalance, getTranUserByCategory, getUserTransactions} from "../models/transactions";


export const transactions = (server: Server) => {

    // Insert a deposit transaction from user
    server.route({
        method: 'POST',
        // @ts-ignore
        config: {
            auth: 'jwt'
        },
        path: '/transactions/deposit/user/{user_id}',
        handler: (request: Request, h: ResponseToolkit) => {
            const user_id = request.params.user_id;
            const user = request.payload; // body: { amount }
            return addUserDepot(user_id, user)
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
        // @ts-ignore
        config: {
            auth: 'jwt'
        },
        handler: (request: Request, h: ResponseToolkit) => {
            const user_id = request.params.user_id;
            const user = request.payload; // body: { amount }
            return addUserWithdraw(user_id, user)
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
        // @ts-ignore
        config: {
            auth: 'jwt'
        },
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

    // Get a user balance with ID
    server.route({
        method: 'GET',
        path: '/transactions/balance/user/{user_id}',
        // @ts-ignore
        config: {
            auth: 'jwt'
        },
        handler: (request: Request, h: ResponseToolkit) => {
            const user_id = request.params.user_id;
            return getTransactionBalance(user_id)
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
        // @ts-ignore
        config: {
            auth: 'jwt'
        },
        path: '/transactions/category/{category}/user/{user_id}',
        handler: (request: Request, h: ResponseToolkit) => {
            const user_id = request.params.user_id;
            const category = request.params.category;
            return getTranUserByCategory(user_id, category)
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
        // @ts-ignore
        config: {
            auth: 'jwt'
        },
        handler: (request: Request, h: ResponseToolkit) => {
            const user_id = request.params.user_id;
            return getUserTransactions(user_id)
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