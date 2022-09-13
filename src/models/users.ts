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
    return {statusCode: 201, message: 'User updated'};
}

export const getUser = async (id: String) => {
    if(isNaN(Number(id))) return {statusCode: 400, message: 'Invalid user ID'};

    const userResults = await knex(process.env.T_USERS)
        .where({id: Number(id)})
        .select('*');
    if (userResults && userResults.length > 0) {
        return {statusCode: 200, event: userResults[0], message: 'Event was found'};
    }
    return {statusCode: 404, message: 'User not found'};
}

export const getEvent = async (id: String) => {
    if(isNaN(Number(id))) return {statusCode: 400, message: 'Invalid event ID'};

    const events_results = await knex(process.env.T_EVENTS)
        .select('*')
        .where({id});
    if (events_results.length > 0) {
        return {statusCode: 200, event: events_results[0], message: 'Event was found'};
    }
    return {statusCode: 404, message: 'Event not found'};

}

export const getBetByOption = async (id: String, bet_option: number) => {
    if(isNaN(Number(id))) return {statusCode: 400, message: 'Invalid bet ID'};
    if(isNaN(bet_option)) return {statusCode: 400, message: 'Invalid option number'};

    const bet_results = await knex(process.env.T_BETS)
        .select('*')
        .where({
            id: Number(id),
            bet_option
        });
    if (bet_results.length > 0) {
        return {statusCode: 200, event: bet_results[0], message: `Bet ${id} with option ${bet_option} was found`};
    }
    return {statusCode: 404, message: `Bet ${id} with option ${bet_option} not found`};
}

export const updateStatusUser = async (id: String, body: Object) => {
    await knex(process.env.T_USERS)
        .where({id: Number(id)})
        .update({
            // @ts-ignore
            user_state: body.state,
            update_at: knex.fn.now()
        });
    return {statusCode: 201, message: 'User updated'};
}