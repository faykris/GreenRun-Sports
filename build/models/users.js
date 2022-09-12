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
exports.updateStatusUser = exports.addBetUser = exports.getEvent = exports.updateUser = exports.addUser = void 0;
const db_1 = __importDefault(require("../database/db"));
const addUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_1.default)(process.env.T_USERS).insert(user);
    return { statusCode: 201, message: 'Add user done' };
});
exports.addUser = addUser;
const updateUser = (id, user) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_1.default)(process.env.T_USERS)
        .where({ id: Number(id) })
        .update(Object.assign(Object.assign({}, user), { update_at: db_1.default.fn.now() }));
    return { statusCode: 201, message: 'User updated' };
});
exports.updateUser = updateUser;
const getEvent = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const events_results = yield (0, db_1.default)(process.env.T_EVENTS)
        .select('*')
        .where({ id });
    if (events_results.length > 0) {
        return { statusCode: 200, event: events_results[0], message: 'Event was found' };
    }
    return { statusCode: 404, message: 'Event not found' };
});
exports.getEvent = getEvent;
const addBetUser = (user_id, event_id, body) => __awaiter(void 0, void 0, void 0, function* () {
    const totalAmount = yield (0, db_1.default)(process.env.T_TRANSACTIONS)
        .sum('amount')
        .where({ user_id })
        .where({ category: 'deposit' })
        .where({ status: 'active' })
        .as('totalAmount');
    const totalWithdraw = yield (0, db_1.default)(process.env.T_TRANSACTIONS)
        .sum('amount')
        .where({ user_id })
        .where({ category: 'withdraw' })
        .where({ status: 'active' })
        .as('totalWithdraw');
    const totalBets = yield (0, db_1.default)(process.env.T_TRANSACTIONS)
        .sum('amount')
        .where({ user_id })
        .where({ category: 'bet' })
        .where({ status: 'active' })
        .as('totalWithdraw');
    const quantity = totalAmount[0]['sum(`amount`)'] - totalWithdraw[0]['sum(`amount`)'] - totalBets[0]['sum(`amount`)'];
    // @ts-ignore
    if (body.amount <= 0) {
        return { statusCode: 400, message: 'The bet can\'t be zero or below zero' };
    }
    if (quantity <= 0) {
        return { statusCode: 400, message: 'The total active amount must be greater than zero' };
    }
    // @ts-ignore
    if (body.amount > quantity) {
        return { statusCode: 400, message: 'The bet can\'t be greater than total active amount' };
    }
    // @ts-ignore
    if (body.option === undefined || body.option <= 0 || body.option > 3) {
        return { statusCode: 400, message: 'Invalid option number' };
    }
    const object = yield (0, exports.getEvent)(event_id);
    let odd = 0;
    // @ts-ignore
    switch (body.option) {
        // @ts-ignore
        case object.event.opt1_id:
            // @ts-ignore
            odd = object.event.odd1_id;
            break;
        // @ts-ignore
        case object.event.opt2_id:
            // @ts-ignore
            odd = object.event.odd2_id;
            break;
        // @ts-ignore
        case object.event.opt3_id:
            // @ts-ignore
            odd = object.event.odd2_id;
            break;
        default:
            break;
    }
    if (odd <= 0) {
        return { statusCode: 400, message: 'The odd for that option can\'t be equal to zero or below zero' };
    }
    // @ts-ignore
    if (object.statusCode === 200) {
        return yield (0, db_1.default)(process.env.T_USER_BETS)
            .insert({
            user_id,
            // @ts-ignore
            bet_id: body.bet_id,
            odd,
            // @ts-ignore
            amount: body.amount,
            status: 'open',
        })
            .returning('id')
            .then((user_bet_id) => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, db_1.default)(process.env.T_TRANSACTIONS)
                .insert({
                user_id: Number(user_id),
                // @ts-ignore
                amount: body.amount,
                category: 'bet',
                status: 'active',
                user_bet_id
            });
            return { statusCode: 201, message: 'Bet done' };
        }));
    }
    return object;
});
exports.addBetUser = addBetUser;
const updateStatusUser = (id, body) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_1.default)(process.env.T_USERS)
        .where({ id: Number(id) })
        .update({
        // @ts-ignore
        user_state: body.state,
        update_at: db_1.default.fn.now()
    });
    return { statusCode: 201, message: 'User updated' };
});
exports.updateStatusUser = updateStatusUser;
