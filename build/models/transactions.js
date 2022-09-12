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
exports.getUserTransactions = exports.getTranUserByCategory = exports.getTransactionBalance = exports.addUserWithdraw = exports.addUserDepot = void 0;
const db_1 = __importDefault(require("../database/db"));
const addUserDepot = (id, user) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_1.default)(process.env.T_TRANSACTIONS)
        .insert(Object.assign(Object.assign({}, user), { user_id: Number(id), category: 'deposit', status: 'active' }));
    return { statusCode: 201, message: 'Deposit transaction done' };
});
exports.addUserDepot = addUserDepot;
const addUserWithdraw = (id, user) => __awaiter(void 0, void 0, void 0, function* () {
    const totalAmount = yield (0, db_1.default)(process.env.T_TRANSACTIONS)
        .sum('amount')
        .where({ user_id: id })
        .where({ category: 'deposit' })
        .where({ status: 'active' });
    const totalWithdraw = yield (0, db_1.default)(process.env.T_TRANSACTIONS)
        .sum('amount')
        .where({ user_id: id })
        .where({ category: 'withdraw' })
        .where({ status: 'active' });
    const totalBets = yield (0, db_1.default)(process.env.T_TRANSACTIONS)
        .sum('amount')
        .where({ id })
        .where({ category: 'bet' })
        .where({ status: 'active' })
        .as('totalWithdraw');
    const quantity = totalAmount[0]['sum(`amount`)'] - totalWithdraw[0]['sum(`amount`)'] - totalBets[0]['sum(`amount`)'];
    // @ts-ignore
    if (user.amount <= 0) {
        return { statusCode: 400, message: 'The withdraw can\'t be zero or below zero' };
    }
    if (quantity <= 0) {
        return { statusCode: 400, message: 'The total active amount must be greater than zero' };
    }
    // @ts-ignore
    if (user.amount > quantity) {
        return { statusCode: 400, message: 'The withdraw can\'t be greater than total active amount' };
    }
    yield (0, db_1.default)(process.env.T_TRANSACTIONS)
        .insert(Object.assign(Object.assign({}, user), { user_id: Number(id), category: 'withdraw', status: 'active' }));
    return { statusCode: 201, message: 'Withdraw transaction done' };
});
exports.addUserWithdraw = addUserWithdraw;
const getTransactionBalance = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const totalAmount = yield (0, db_1.default)(process.env.T_TRANSACTIONS)
        .sum('amount')
        .where({ user_id: id })
        .where({ category: 'deposit' })
        .where({ status: 'active' });
    const totalWithdraw = yield (0, db_1.default)(process.env.T_TRANSACTIONS)
        .sum('amount')
        .where({ user_id: id })
        .where({ category: 'withdraw' })
        .where({ status: 'active' });
    const totalBets = yield (0, db_1.default)(process.env.T_TRANSACTIONS)
        .sum('amount')
        .where({ id })
        .where({ category: 'bet' })
        .where({ status: 'active' })
        .as('totalWithdraw');
    const quantity = totalAmount[0]['sum(`amount`)'] - totalWithdraw[0]['sum(`amount`)'] - totalBets[0]['sum(`amount`)'];
    return { statusCode: 200, balance: quantity, message: 'Balance transactions done' };
});
exports.getTransactionBalance = getTransactionBalance;
const getTranUserByCategory = (user_id, category) => __awaiter(void 0, void 0, void 0, function* () {
    const totalTransactions = yield (0, db_1.default)(process.env.T_TRANSACTIONS)
        .select('*')
        .where({ user_id })
        .where({ category });
    return { statusCode: 200, transactions: totalTransactions, message: 'Get own transactions done' };
});
exports.getTranUserByCategory = getTranUserByCategory;
const getUserTransactions = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    const totalTransactions = yield (0, db_1.default)(process.env.T_TRANSACTIONS)
        .select('*')
        .where({ user_id });
    return { statusCode: 200, transactions: totalTransactions, message: 'Get user transactions done' };
});
exports.getUserTransactions = getUserTransactions;
