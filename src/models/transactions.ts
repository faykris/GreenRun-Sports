import knex from '../database/db';
import {getBetByOption, getEvent, getUser} from "./users";

export const addUserDepot = async (id: String, body: Object) => {
    const userObject = await getUser(id);
    if (userObject.statusCode !== 200) return userObject;

    // @ts-ignore
    const amount = body.amount || null;

    if (!amount) return {statusCode: 400, message: "The field 'amount' is not specified to deposit"};
    if (isNaN(amount)) return {statusCode: 400, message: "The field 'amount' must be a number"};
    if (amount <= 0) return {statusCode: 400, message: 'Invalid amount value to deposit'};

    await knex(process.env.T_TRANSACTIONS)
        .insert({
            amount,
            user_id: Number(id),
            category: 'deposit',
            status: 'active',
        });
    return {statusCode: 201, message: 'Deposit transaction done'}
}

export const addUserWithdraw = async (user_id: String, body: Object) => {
    const userObject = await getUser(user_id);
    if (userObject.statusCode !== 200) return userObject;

    // @ts-ignore
    const amount = body.amount || null;

    if (!amount) return {statusCode: 400, message: "The field 'amount' is not specified to withdraw"};
    if (isNaN(amount)) return {statusCode: 400, message: "The field 'amount' must be a number"};
    if (amount <= 0) return {statusCode: 400, message: 'Invalid amount value to withdraw'};

    const balanceObj = await getTransactionBalance(user_id);
    // @ts-ignore
    const quantity = balanceObj.balance;

    if (quantity <= 0) {
        return {statusCode: 400, message: 'The total active amount must be greater than zero'};
    }
    if (amount > quantity) {
        return {statusCode: 400, message: 'The withdraw can\'t be greater than total active amount'};
    }
    await knex(process.env.T_TRANSACTIONS)
        .insert({
            amount,
            user_id: Number(user_id),
            category: 'withdraw',
            status: 'active',
        });
    return {statusCode: 201, message: 'Withdraw transaction done'}
}

export const addBetUser = async (user_id: String, event_id: String, body: Object) => {
    const userObj = await getUser(user_id);
    if (userObj.statusCode !== 200) return userObj;
    const eventObj = await getEvent(event_id);
    if (eventObj.statusCode !== 200) return eventObj;

    // @ts-ignore
    const amount = body.amount || null;
    // @ts-ignore
    const option = body.option || null;
    // @ts-ignore
    const bet_id = body.bet_id || null;

    if (!amount) return {statusCode: 400, message: "The field 'amount' is not specified to bet"};
    if (!option) return {statusCode: 400, message: "The field 'option' is not specified to bet"};
    if (!bet_id) return {statusCode: 400, message: "The field 'bet_id' is not specified to bet"};
    if (isNaN(amount)) return {statusCode: 400, message: "The field 'amount' must be a number"};
    if (isNaN(option)) return {statusCode: 400, message: "The field 'option' must be a number"};
    if (amount <= 0) return {statusCode: 400, message: 'Invalid amount value to bet'};
    if (option <= 0 || option > 3) return {statusCode: 400, message: 'Invalid option value to bet'};
    if (option === 3 && !eventObj.event.bet_opt3) return {statusCode: 400, message: 'Invalid option value to bet'};

    const betObj = await getBetByOption(bet_id, option);
    if (betObj.statusCode !== 200) return betObj;

    const balanceObj = await getTransactionBalance(user_id);
    // @ts-ignore
    const quantity = balanceObj.balance;
    if (quantity <= 0) return {statusCode: 400, message: 'The total active amount must be greater than zero'};
    if (amount > quantity) return {statusCode: 400, message: 'The withdraw can\'t be greater than total active amount'};

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

    if (!odd) return {statusCode: 400, message: 'Invalid odd value'};
    if (odd <= 1) return {statusCode: 400, message: 'The odd for that option can\'t be equal to 1 or below 1'};

    return await knex(process.env.T_USER_BETS)
        .insert({
            user_id: Number(user_id),
            bet_id,
            odd,
            amount,
            status: 'open',
        })
        .returning('id')
        .then(async (user_bet_id) => {
            await knex(process.env.T_TRANSACTIONS)
                .insert({
                    user_id: Number(user_id),
                    amount,
                    category: 'bet',
                    status: 'active',
                    user_bet_id
                });
            return {statusCode: 201, message: 'Bet transaction done'}
        });
}

export const getTransactionBalance = async (user_id: String) => {
    const userObj = await getUser(user_id);
    if (userObj.statusCode !== 200) return userObj;

    const totalDepot = await knex(process.env.T_TRANSACTIONS)
        .sum('amount')
        .where({user_id})
        .where({category: 'deposit'})
        .where({status: 'active'});
    const totalWithdraw = await knex(process.env.T_TRANSACTIONS)
        .sum('amount')
        .where({user_id})
        .where({category: 'withdraw'})
        .where({status: 'active'});
    const totalBets = await knex(process.env.T_TRANSACTIONS)
        .sum('amount')
        .where({user_id})
        .where({category: 'bet'})
        .where({status: 'active'});
    const totalWinnings = await knex(process.env.T_TRANSACTIONS)
        .sum('amount')
        .where({user_id})
        .where({category: 'winning'})
        .where({status: 'active'});

    const depots = totalDepot[0]['sum(`amount`)'] || 0;
    const winnings = totalWinnings[0]['sum(`amount`)'] || 0;
    const withdraws = totalWithdraw[0]['sum(`amount`)'] || 0;
    const bets = totalBets[0]['sum(`amount`)'] || 0;
    const quantity = (depots + winnings) - (withdraws + bets);

    return {statusCode: 200, balance: quantity, message: 'Get balance transactions done'};
}

export const getTranUserByCategory = async (user_id: String, category: String) => {
    const totalTransactions = await knex(process.env.T_TRANSACTIONS)
        .select('*')
        .where({user_id})
        .where({category});

    return {statusCode: 200, transactions: totalTransactions, message: `Get transactions by category ${category} done`};
}

export const getUserTransactions = async (user_id: String) => {
    const totalTransactions = await knex(process.env.T_TRANSACTIONS)
        .select('*')
        .where({user_id})

    return {statusCode: 200, transactions: totalTransactions, message: 'Get user transactions done'};
}