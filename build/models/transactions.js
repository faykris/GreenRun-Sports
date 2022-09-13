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
exports.getUserTransactions = exports.getTranUserByCategory = exports.getTransactionBalance = exports.addBetUser = exports.addUserWithdraw = exports.addUserDepot = void 0;
const db_1 = __importDefault(require("../database/db"));
const users_1 = require("./users");
const addUserDepot = (id, body) => __awaiter(void 0, void 0, void 0, function* () {
    const userObject = yield (0, users_1.getUser)(id);
    if (userObject.statusCode !== 200)
        return userObject;
    // @ts-ignore
    const amount = body.amount || null;
    if (!amount)
        return { statusCode: 400, message: "The field 'amount' is not specified to deposit" };
    if (isNaN(amount))
        return { statusCode: 400, message: "The field 'amount' must be a number" };
    if (amount <= 0)
        return { statusCode: 400, message: 'Invalid amount value to deposit' };
    yield (0, db_1.default)(process.env.T_TRANSACTIONS)
        .insert({
        amount,
        user_id: Number(id),
        category: 'deposit',
        status: 'active',
    });
    return { statusCode: 201, message: 'Deposit transaction done' };
});
exports.addUserDepot = addUserDepot;
const addUserWithdraw = (user_id, body) => __awaiter(void 0, void 0, void 0, function* () {
    const userObject = yield (0, users_1.getUser)(user_id);
    if (userObject.statusCode !== 200)
        return userObject;
    // @ts-ignore
    const amount = body.amount || null;
    if (!amount)
        return { statusCode: 400, message: "The field 'amount' is not specified to withdraw" };
    if (isNaN(amount))
        return { statusCode: 400, message: "The field 'amount' must be a number" };
    if (amount <= 0)
        return { statusCode: 400, message: 'Invalid amount value to withdraw' };
    const balanceObj = yield (0, exports.getTransactionBalance)(user_id);
    // @ts-ignore
    const quantity = balanceObj.balance;
    if (quantity <= 0) {
        return { statusCode: 400, message: 'The total active amount must be greater than zero' };
    }
    if (amount > quantity) {
        return { statusCode: 400, message: 'The withdraw can\'t be greater than total active amount' };
    }
    yield (0, db_1.default)(process.env.T_TRANSACTIONS)
        .insert({
        amount,
        user_id: Number(user_id),
        category: 'withdraw',
        status: 'active',
    });
    return { statusCode: 201, message: 'Withdraw transaction done' };
});
exports.addUserWithdraw = addUserWithdraw;
const addBetUser = (user_id, event_id, body) => __awaiter(void 0, void 0, void 0, function* () {
    const userObj = yield (0, users_1.getUser)(user_id);
    if (userObj.statusCode !== 200)
        return userObj;
    const eventObj = yield (0, users_1.getEvent)(event_id);
    if (eventObj.statusCode !== 200)
        return eventObj;
    // @ts-ignore
    const amount = body.amount || null;
    // @ts-ignore
    const option = body.option || null;
    // @ts-ignore
    const bet_id = body.bet_id || null;
    if (!amount)
        return { statusCode: 400, message: "The field 'amount' is not specified to bet" };
    if (!option)
        return { statusCode: 400, message: "The field 'option' is not specified to bet" };
    if (!bet_id)
        return { statusCode: 400, message: "The field 'bet_id' is not specified to bet" };
    if (isNaN(amount))
        return { statusCode: 400, message: "The field 'amount' must be a number" };
    if (isNaN(option))
        return { statusCode: 400, message: "The field 'option' must be a number" };
    if (amount <= 0)
        return { statusCode: 400, message: 'Invalid amount value to bet' };
    if (option <= 0 || option > 3)
        return { statusCode: 400, message: 'Invalid option value to bet' };
    if (option === 3 && !eventObj.event.bet_opt3)
        return { statusCode: 400, message: 'Invalid option value to bet' };
    const betObj = yield (0, users_1.getBetByOption)(bet_id, option);
    if (betObj.statusCode !== 200)
        return betObj;
    const balanceObj = yield (0, exports.getTransactionBalance)(user_id);
    // @ts-ignore
    const quantity = balanceObj.balance;
    if (quantity <= 0)
        return { statusCode: 400, message: 'The total active amount must be greater than zero' };
    if (amount > quantity)
        return { statusCode: 400, message: 'The withdraw can\'t be greater than total active amount' };
    let odd = 0;
    switch (option) {
        case eventObj.event.bet_opt1:
            odd = eventObj.event.bet_odd1;
            break;
        case eventObj.event.bet_opt2:
            odd = eventObj.event.bet_odd2;
            break;
        case eventObj.event.bet_opt3:
            odd = eventObj.event.bet_odd3;
            break;
        default:
            break;
    }
    if (!odd)
        return { statusCode: 400, message: 'Invalid odd value' };
    if (odd <= 1)
        return { statusCode: 400, message: 'The odd for that option can\'t be equal to 1 or below 1' };
    return yield (0, db_1.default)(process.env.T_USER_BETS)
        .insert({
        user_id: Number(user_id),
        bet_id,
        odd,
        amount,
        status: 'open',
    })
        .returning('id')
        .then((user_bet_id) => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, db_1.default)(process.env.T_TRANSACTIONS)
            .insert({
            user_id: Number(user_id),
            amount,
            category: 'bet',
            status: 'active',
            user_bet_id
        });
        return { statusCode: 201, message: 'Bet transaction done' };
    }));
});
exports.addBetUser = addBetUser;
const getTransactionBalance = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    const userObj = yield (0, users_1.getUser)(user_id);
    if (userObj.statusCode !== 200)
        return userObj;
    const totalDepot = yield (0, db_1.default)(process.env.T_TRANSACTIONS)
        .sum('amount')
        .where({ user_id })
        .where({ category: 'deposit' })
        .where({ status: 'active' });
    const totalWithdraw = yield (0, db_1.default)(process.env.T_TRANSACTIONS)
        .sum('amount')
        .where({ user_id })
        .where({ category: 'withdraw' })
        .where({ status: 'active' });
    const totalBets = yield (0, db_1.default)(process.env.T_TRANSACTIONS)
        .sum('amount')
        .where({ user_id })
        .where({ category: 'bet' })
        .where({ status: 'active' });
    const totalWinnings = yield (0, db_1.default)(process.env.T_TRANSACTIONS)
        .sum('amount')
        .where({ user_id })
        .where({ category: 'winning' })
        .where({ status: 'active' });
    const depots = totalDepot[0]['sum(`amount`)'] || 0;
    const winnings = totalWinnings[0]['sum(`amount`)'] || 0;
    const withdraws = totalWithdraw[0]['sum(`amount`)'] || 0;
    const bets = totalBets[0]['sum(`amount`)'] || 0;
    const quantity = (depots + winnings) - (withdraws + bets);
    return { statusCode: 200, balance: quantity, message: 'Get balance transactions done' };
});
exports.getTransactionBalance = getTransactionBalance;
const getTranUserByCategory = (user_id, category) => __awaiter(void 0, void 0, void 0, function* () {
    const totalTransactions = yield (0, db_1.default)(process.env.T_TRANSACTIONS)
        .select('*')
        .where({ user_id })
        .where({ category });
    return { statusCode: 200, transactions: totalTransactions, message: `Get transactions by category ${category} done` };
});
exports.getTranUserByCategory = getTranUserByCategory;
const getUserTransactions = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    const totalTransactions = yield (0, db_1.default)(process.env.T_TRANSACTIONS)
        .select('*')
        .where({ user_id });
    return { statusCode: 200, transactions: totalTransactions, message: 'Get user transactions done' };
});
exports.getUserTransactions = getUserTransactions;
