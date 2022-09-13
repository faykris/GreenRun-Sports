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
exports.updateStatusUser = exports.getBetByOption = exports.getEvent = exports.getUser = exports.updateUser = exports.addUser = void 0;
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
const getUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (isNaN(Number(id)))
        return { statusCode: 400, message: 'Invalid user ID' };
    const userResults = yield (0, db_1.default)(process.env.T_USERS)
        .where({ id: Number(id) })
        .select('*');
    if (userResults && userResults.length > 0) {
        return { statusCode: 200, event: userResults[0], message: 'Event was found' };
    }
    return { statusCode: 404, message: 'User not found' };
});
exports.getUser = getUser;
const getEvent = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (isNaN(Number(id)))
        return { statusCode: 400, message: 'Invalid event ID' };
    const events_results = yield (0, db_1.default)(process.env.T_EVENTS)
        .select('*')
        .where({ id });
    if (events_results.length > 0) {
        return { statusCode: 200, event: events_results[0], message: 'Event was found' };
    }
    return { statusCode: 404, message: 'Event not found' };
});
exports.getEvent = getEvent;
const getBetByOption = (id, bet_option) => __awaiter(void 0, void 0, void 0, function* () {
    if (isNaN(Number(id)))
        return { statusCode: 400, message: 'Invalid bet ID' };
    if (isNaN(bet_option))
        return { statusCode: 400, message: 'Invalid option number' };
    const bet_results = yield (0, db_1.default)(process.env.T_BETS)
        .select('*')
        .where({
        id: Number(id),
        bet_option
    });
    if (bet_results.length > 0) {
        return { statusCode: 200, event: bet_results[0], message: `Bet ${id} with option ${bet_option} was found` };
    }
    return { statusCode: 404, message: `Bet ${id} with option ${bet_option} not found` };
});
exports.getBetByOption = getBetByOption;
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
