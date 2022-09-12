import knex from '../database/db';

export const addUser = async (user: Object) => {
    await knex(process.env.T_USERS).insert(user);
    return {statusCode: 201, message: 'Add user done'}
}

export const updateUser = async (id: String, user: Object) => {
    await knex(process.env.T_USERS)
        .where({id: Number(id)})
        .update({
            ...user,
            update_at: knex.fn.now()
        });
    return {statusCode: 201, message: 'User updated'}
}

export const getEvent = async (id: String) => {
    const events_results = await knex(process.env.T_EVENTS)
        .select('*')
        .where({id});
    if (events_results.length > 0) {
        return {statusCode: 200, event: events_results[0], message: 'Event was found'};
    }
    return {statusCode: 404, message: 'Event not found'};

}

export const addBetUser = async (user_id: String, event_id: String, body: Object) => {
    const totalAmount = await knex(process.env.T_TRANSACTIONS)
        .sum('amount')
        .where({user_id})
        .where({category: 'deposit'})
        .where({status: 'active'})
        .as('totalAmount');

    const totalWithdraw = await knex(process.env.T_TRANSACTIONS)
        .sum('amount')
        .where({user_id})
        .where({category: 'withdraw'})
        .where({status: 'active'})
        .as('totalWithdraw');

    const totalBets = await knex(process.env.T_TRANSACTIONS)
        .sum('amount')
        .where({user_id})
        .where({category: 'bet'})
        .where({status: 'active'})
        .as('totalWithdraw');

    const quantity = totalAmount[0]['sum(`amount`)'] - totalWithdraw[0]['sum(`amount`)'] - totalBets[0]['sum(`amount`)'];

    // @ts-ignore
    if (body.amount <= 0) {
        return {statusCode: 400, message: 'The bet can\'t be zero or below zero' };
    }

    if (quantity <= 0) {
        return {statusCode: 400, message: 'The total active amount must be greater than zero'};
    }
    // @ts-ignore
    if (body.amount > quantity) {
        return {statusCode: 400, message: 'The bet can\'t be greater than total active amount'};
    }
    // @ts-ignore
    if (body.option === undefined || body.option <= 0 || body.option > 3)  {
        return {statusCode: 400, message: 'Invalid option number'};
    }
    const object = await getEvent(event_id);

    let odd = 0;
    // @ts-ignore
    switch (body.option) {
        // @ts-ignore
        case object.event.bet_opt1:
        // @ts-ignore
            odd = object.event.odd1_id;
            break;
        // @ts-ignore
        case object.event.bet_opt2:
            // @ts-ignore
            odd = object.event.odd2_id;
            break;
        // @ts-ignore
        case object.event.bet_opt3:
            // @ts-ignore
            odd = object.event.odd2_id;
            break;
        default:
            break;
    }

    if (odd <= 0) {
        return {statusCode: 400, message: 'The odd for that option can\'t be equal to zero or below zero'};
    }
    // @ts-ignore
    if (object.statusCode === 200) {
        return await knex(process.env.T_USER_BETS)
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
            .then(async (user_bet_id) => {
                await knex(process.env.T_TRANSACTIONS)
                    .insert({
                        user_id: Number(user_id),
                        // @ts-ignore
                        amount: body.amount,
                        category: 'bet',
                        status: 'active',
                        user_bet_id
                    });
                return {statusCode: 201, message: 'Bet done'}
            })
    }
    return object;
}

export const updateStatusUser = async (id: String, body: Object) => {
    await knex(process.env.T_USERS)
        .where({id: Number(id)})
        .update({
            // @ts-ignore
            user_state: body.state,
            update_at: knex.fn.now()
        });
    return {statusCode: 201, message: 'User updated'}
}