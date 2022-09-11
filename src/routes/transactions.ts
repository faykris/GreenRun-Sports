import { Server, Request, ResponseToolkit } from '@hapi/hapi';
import {addUserDepot, addUserWithdraw, getTransactionBalance, getTranUserByCategory, getUserTransactions} from "../models/transactions";


export const transactions = (server: Server) => {

    server.route({
        method: 'POST',
        path: '/transactions/deposit/user/{id}',
        handler: (request: Request, h: ResponseToolkit) => {
            const id = request.params.id;
            const user = request.payload;
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

    server.route({
        method: 'POST',
        path: '/transactions/withdraw/user/{id}',
        handler: (request: Request, h: ResponseToolkit) => {
            const id = request.params.id;
            const user = request.payload;
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

    // ----- admin endpoints ------
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