"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bets = void 0;
const bets_1 = require("../models/bets");
const bets = (server) => {
    // Select all transactions by sport
    server.route({
        method: 'GET',
        path: '/transaction/bets/sport/{sport}',
        handler: (request, h) => {
            const sport = request.params.sport;
            return (0, bets_1.getBetsListBySport)(sport)
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
        path: '/transaction/bets/name/{name}',
        handler: (request, h) => {
            const name = request.params.name;
            return (0, bets_1.getBetsListByEvent)(name)
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
        handler: (request, h) => {
            const event_id = request.params.event_id;
            const body = request.payload; // {status: 'active' || 'cancelled'}
            return (0, bets_1.changeBetStatus)(event_id, body)
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
        handler: (request, h) => {
            const event_id = request.params.event_id;
            const body = request.payload; // {status: 'settled'}
            return (0, bets_1.settleBet)(event_id, body)
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
exports.bets = bets;
