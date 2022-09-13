import { Server, Request, ResponseToolkit } from '@hapi/hapi';
import {getBetsListBySport, getBetsListByEvent, changeBetStatus, settleBet} from "../models/bets";

export const bets = (server: Server) => {

    // Select all transactions by sport
    server.route({
        method: 'GET',
        path: '/transactions/bets/sport/{sport}',
        handler: (request: Request, h: ResponseToolkit) => {
            const sport = request.params.sport;
            return getBetsListBySport(sport)
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

    // Select all transactions by bet option name
    server.route({
        method: 'GET',
        path: '/transactions/bets/name/{name}',
        handler: (request: Request, h: ResponseToolkit) => {
            const name = request.params.name;
            return getBetsListByEvent(name)
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

    // ADMIN: Change status of an event - active or cancelled
    server.route({
        method: 'PUT',
        path: '/bets/status/event/{event_id}',
        handler: (request: Request, h: ResponseToolkit) => {
            const event_id = request.params.event_id;
            const body = request.payload; // {status: 'active' || 'cancelled'}
            return changeBetStatus(event_id, body)
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

    // ADMIN: Settle an event, close bets and pay to winners
    server.route({
        method: 'PUT',
        path: '/bets/settle/event/{event_id}',
        handler: (request: Request, h: ResponseToolkit) => {
            const event_id = request.params.event_id;
            const body = request.payload; // {status: 'settled'}
            return settleBet(event_id, body)
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