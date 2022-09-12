import knex from '../database/db';
import {getEvent} from "./users";


export const getBetsListBySport = async (sport: String) => {
    const totalBets = await knex(process.env.T_BETS)
        .select('*')
        .where({sport});
    return {statusCode: 200, bets: totalBets, message: 'Get bets by sport done'}
}

export const getBetsListByEvent = async (name: String) => {
    const totalBets = await knex(process.env.T_BETS)
        .select('*')
        .where({name});
    return {statusCode: 200, bets: totalBets, message: 'Get bets by name done'}
}

export const changeBetStatus = async (event_id: String, body: Object) => {
    await knex(process.env.T_EVENTS)
        .where({id: Number(event_id)})
        .update({
            // @ts-ignore
            status: body.status,
            update_at: knex.fn.now()
        });

    await knex(process.env.T_BETS)
        .where({event_id: Number(event_id)})
        .update({
            // @ts-ignore
            status: body.status,
            update_at: knex.fn.now()
        });
    return {statusCode: 201, message: 'Event status updated'}
}

export const settleBet = async (event_id: String, body: Object) => {
    const event_obj = await getEvent(event_id);

    if (!event_obj.event.status || event_obj.event.status === 'cancel') {
        return {statusCode: 400, message: 'Invalid status to settle bet'}
    }
    // @ts-ignore
    if (!body.option || body.option < 1 || body.option > 3) {
        return {statusCode: 400, message: 'Invalid option to settle bet'}
    }
    // Change status of event to settled
    await knex(process.env.T_EVENTS)
        .where({id: Number(event_id)})
        .update({
            // @ts-ignore
            status: body.status,
            // @ts-ignore
            won_opt: body.option,
            update_at: knex.fn.now()
        });

    // Select corresponding bets to be settled
    await knex(process.env.T_BETS)
        .select('id', 'bet_option', 'name' )
        .where({event_id: Number(event_id)})
        .then( (bets) => {
            bets.map(async (bet) => {
                // @ts-ignore
                const result = bet.bet_option === body.option ? 'won' : 'lost';

                // Update status from bets if are winners or losers
                await knex(process.env.T_BETS)
                    .where({
                        event_id,
                        id: bet.id
                    })
                    .update({
                        result,
                        update_at: knex.fn.now()
                    })
                    .then(async () => {
                        // Update status from bets users if are winners or losers
                        await knex(process.env.T_USER_BETS)
                            .where({
                                bet_id: bet.id
                            })
                            .update({
                                status: result,
                                update_at: knex.fn.now()
                            })
                            .then(async () => {
                                // select user bets for search corresponding transactions
                                await knex(process.env.T_USER_BETS)
                                    .select('id', 'user_id', 'odd', 'amount', 'status')
                                    .where({
                                        id: bet.id
                                    }).then(async (user_bets) => {
                                        user_bets.map(async (user_bet) => {
                                            // Close all settled bets by user ID
                                            await knex(process.env.T_TRANSACTIONS)
                                                .where({
                                                    user_id: user_bet.user_id,
                                                    status: 'active',
                                                    category: 'bet'
                                                })
                                                .update({
                                                    status: 'closed',
                                                    update_at: knex.fn.now()
                                                });
                                            // make new transactions to winners
                                            if (user_bet.status === 'won') {
                                                await knex(process.env.T_TRANSACTIONS)
                                                    .insert({
                                                        user_id: user_bet.user_id,
                                                        amount: user_bet.amount * user_bet.odd,
                                                        category: 'winning',
                                                        status: 'active',
                                                        user_bet_id: user_bet.id
                                                    });
                                            }
                                        });
                                    });
                            });
                    });
            });
        });

    return {statusCode: 201, message: 'Event status was settled successfully'}
}
