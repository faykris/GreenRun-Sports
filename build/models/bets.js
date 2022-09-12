"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.settleBet = exports.changeBetStatus = exports.getBetsListByEvent = exports.getBetsListBySport = void 0;
const db_1 = __importDefault(require("../database/db"));
const users_1 = require("./users");
const getBetsListBySport = (sport) => __awaiter(void 0, void 0, void 0, function* () {
    const totalBets = yield (0, db_1.default)(process.env.T_BETS)
        .select('*')
        .where({ sport });
    return { statusCode: 200, bets: totalBets, message: 'Get bets by sport done' };
});
exports.getBetsListBySport = getBetsListBySport;
const getBetsListByEvent = (name) => __awaiter(void 0, void 0, void 0, function* () {
    const totalBets = yield (0, db_1.default)(process.env.T_BETS)
        .select('*')
        .where({ name });
    return { statusCode: 200, bets: totalBets, message: 'Get bets by name done' };
});
exports.getBetsListByEvent = getBetsListByEvent;
const changeBetStatus = (event_id, body) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_1.default)(process.env.T_EVENTS)
        .where({ id: Number(event_id) })
        .update({
        // @ts-ignore
        status: body.status,
        update_at: db_1.default.fn.now()
    });
    yield (0, db_1.default)(process.env.T_BETS)
        .where({ event_id: Number(event_id) })
        .update({
        // @ts-ignore
        status: body.status,
        update_at: db_1.default.fn.now()
    });
    return { statusCode: 201, message: 'Event status updated' };
});
exports.changeBetStatus = changeBetStatus;
const settleBet = (event_id, body) => __awaiter(void 0, void 0, void 0, function* () {
    const event_obj = yield (0, users_1.getEvent)(event_id);
    if (!event_obj.event.status || event_obj.event.status === 'cancel') {
        return { statusCode: 400, message: 'Invalid status to settle bet' };
    }
    // @ts-ignore
    if (!body.option || body.option < 1 || body.option > 3) {
        return { statusCode: 400, message: 'Invalid option to settle bet' };
    }
    // Change status of event to settled
    yield (0, db_1.default)(process.env.T_EVENTS)
        .where({ id: Number(event_id) })
        .update({
        // @ts-ignore
        status: body.status,
        // @ts-ignore
        winner_id: body.option,
        update_at: db_1.default.fn.now()
    });
    // Select corresponding bets to be settled
    yield (0, db_1.default)(process.env.T_BETS)
        .select('id', 'bet_option', 'name')
        .where({ event_id: Number(event_id) })
        .then((bets) => {
        bets.map((bet) => __awaiter(void 0, void 0, void 0, function* () {
            // @ts-ignore
            const result = bet.bet_option === body.option ? 'won' : 'lost';
            // Update status from bets if are winners or losers
            yield (0, db_1.default)(process.env.T_BETS)
                .where({
                event_id,
                id: bet.id
            })
                .update({
                result,
                update_at: db_1.default.fn.now()
            })
                .then(() => __awaiter(void 0, void 0, void 0, function* () {
                // Update status from bets users if are winners or losers
                yield (0, db_1.default)(process.env.T_USER_BETS)
                    .where({
                    bet_id: bet.id
                })
                    .update({
                    status: result,
                    update_at: db_1.default.fn.now()
                })
                    .then(() => __awaiter(void 0, void 0, void 0, function* () {
                    // select user bets for search corresponding transactions
                    yield (0, db_1.default)(process.env.T_USER_BETS)
                        .select('id', 'user_id', 'odd', 'amount', 'status')
                        .where({
                        id: bet.id
                    }).then((user_bets) => __awaiter(void 0, void 0, void 0, function* () {
                        user_bets.map((user_bet) => __awaiter(void 0, void 0, void 0, function* () {
                            // Close all settled bets by user ID
                            yield (0, db_1.default)(process.env.T_TRANSACTIONS)
                                .where({
                                user_id: user_bet.user_id,
                                status: 'active',
                                category: 'bet'
                            })
                                .update({
                                status: 'closed',
                                update_at: db_1.default.fn.now()
                            });
                            // make new transactions to winners
                            if (user_bet.status === 'won') {
                                yield (0, db_1.default)(process.env.T_TRANSACTIONS)
                                    .insert({
                                    user_id: user_bet.user_id,
                                    amount: user_bet.amount * user_bet.odd,
                                    category: 'winning',
                                    status: 'active',
                                    user_bet_id: user_bet.id
                                });
                            }
                        }));
                    }));
                }));
            }));
        }));
    });
    return { statusCode: 201, message: 'Event status was settled successfully' };
});
exports.settleBet = settleBet;
