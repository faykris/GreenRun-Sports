import knex from '../database/db';

export const addUserDepot = async (id: String, user: Object) => {
    await knex(process.env.T_TRANSACTIONS)
        .insert({
            ...user,
            user_id: Number(id),
            category: 'deposit',
            status: 'active',
        });
    return {statusCode: 201, message: 'Deposit transaction done'}
}

export const addUserWithdraw = async (id: String, user: Object) => {

    const totalAmount = await knex(process.env.T_TRANSACTIONS)
        .sum('amount')
        .where({user_id: id})
        .where({category: 'deposit'})
        .where({status: 'active'});

    const totalWithdraw = await knex(process.env.T_TRANSACTIONS)
        .sum('amount')
        .where({user_id: id})
        .where({category: 'withdraw'})
        .where({status: 'active'});

    const totalBets = await knex(process.env.T_TRANSACTIONS)
        .sum('amount')
        .where({id})
        .where({category: 'bet'})
        .where({status: 'active'})
        .as('totalWithdraw');

    const quantity = totalAmount[0]['sum(`amount`)'] - totalWithdraw[0]['sum(`amount`)'] - totalBets[0]['sum(`amount`)'];

    // @ts-ignore
    if (user.amount <= 0) {
        return {statusCode: 400, message: 'The withdraw can\'t be zero or below zero' };
    }

    if (quantity <= 0) {
        return {statusCode: 400, message: 'The total active amount must be greater than zero'};
    }
    // @ts-ignore
    if (user.amount > quantity) {
        return {statusCode: 400, message: 'The withdraw can\'t be greater than total active amount'};
    }
    await knex(process.env.T_TRANSACTIONS)
        .insert({
            ...user,
            user_id: Number(id),
            category: 'withdraw',
            status: 'active',
        });
    return {statusCode: 201, message: 'Withdraw transaction done'}
}

export const getTransactionBalance = async (id: String) => {

    const totalAmount = await knex(process.env.T_TRANSACTIONS)
        .sum('amount')
        .where({user_id: id})
        .where({category: 'deposit'})
        .where({status: 'active'});

    const totalWithdraw = await knex(process.env.T_TRANSACTIONS)
        .sum('amount')
        .where({user_id: id})
        .where({category: 'withdraw'})
        .where({status: 'active'});

    const totalBets = await knex(process.env.T_TRANSACTIONS)
        .sum('amount')
        .where({id})
        .where({category: 'bet'})
        .where({status: 'active'})
        .as('totalWithdraw');

    const quantity = totalAmount[0]['sum(`amount`)'] - totalWithdraw[0]['sum(`amount`)'] - totalBets[0]['sum(`amount`)'];

    return {statusCode: 200, balance: quantity, message: 'Balance transactions done'}
}

export const getTranUserByCategory = async (user_id: String, category: String) => {

    const totalTransactions = await knex(process.env.T_TRANSACTIONS)
        .select('*')
        .where({user_id})
        .where({category});

    return {statusCode: 200, transactions: totalTransactions, message: 'Get own transactions done'}
}

export const getUserTransactions = async (user_id: String) => {
    const totalTransactions = await knex(process.env.T_TRANSACTIONS)
        .select('*')
        .where({user_id})

    return {statusCode: 200, transactions: totalTransactions, message: 'Get user transactions done'}
}