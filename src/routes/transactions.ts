import { Server, Request, ResponseToolkit } from '@hapi/hapi';
import { addUserDepot, addUserWithdraw, addBetUser, getTransactionBalance, getTranUserByCategory, getUserTransactions} from "../models/transactions";


export const transactions = (server: Server) => {

    // Insert a deposit transaction from user
    server.route({
        method: 'POST',
        path: '/transactions/deposit/user/{id}',
        handler: (request: Request, h: ResponseToolkit) => {
            const id = request.params.id;
            const user = request.payload; // body: { amount }
            return addUserDepot(id, user)
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
        path: '/transactions/withdraw/user/{id}',
        handler: (request: Request, h: ResponseToolkit) => {
            const id = request.params.id;
            const user = request.payload; // body: { amount }
            return addUserWithdraw(id, user)
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

    // Get a user balance with their ID
    server.route({
        method: 'GET',
        path: '/transactions/balance/user/{id}',
        handler: (request: Request, h: ResponseToolkit) => {
            const id = request.params.id;
            return getTransactionBalance(id)
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
        path: '/transactions/{category}/{id}',
        handler: (request: Request, h: ResponseToolkit) => {
            const id = request.params.id;
            const category = request.params.category;
            return getTranUserByCategory(id, category)
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