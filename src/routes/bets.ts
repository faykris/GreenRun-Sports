import { Server, Request, ResponseToolkit } from '@hapi/hapi';
import {getBetsListBySport, getBetsListByEvent, changeBetStatus, settleBet} from "../models/bets";

export const bets = (server: Server) => {
    server.route({
        method: 'GET',
        path: '/transaction/bets/sport/{sport}',
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

    server.route({
        method: 'GET',
        path: '/transaction/bets/name/{name}',
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

    //admin endpoint
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

    //admin endpoint
    server.route({
        method: 'PUT',
        path: '/bets/settle/event/{event_id}',
        handler: (request: Request, h: ResponseToolkit) => {
            const event_id = request.params.event_id;
            const body = request.payload;
            return settleBet(event_id, body) // {status: 'settled' || 'cancelled'}
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