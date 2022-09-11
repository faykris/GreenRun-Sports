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
    console.log('event_id:', event_id);
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
    await knex(process.env.T_EVENTS)
        .where({id: Number(event_id)})
        .update({
            // @ts-ignore
            status: body.status,
            // @ts-ignore
            winner_id: body.option,
            update_at: knex.fn.now()
        });
     // const betsByEventID =
    await knex(process.env.T_BETS)
        .select('id', 'bet_option', 'name' )
        .where({event_id: Number(event_id)})
        .then( async (bet) => {
            // @ts-ignore
            const isWinner = bet.bet_option === body.option ? 'won' : 'lost';

            await knex(process.env.T_BETS)
                .where({event_id: Number(event_id)})
                .update({
                    // @ts-ignore
                    status: body.status,
                    result: isWinner,
                    update_at: knex.fn.now()
                });
            // @ts-ignore
            console.log('bet name:', bet.name );
            console.log('is winner option:', isWinner);
            console.log('event_id:', event_id)
            // @ts-ignore
            console.log('bet_id:', bet.id);

            const betsUserByBetID = await knex(process.env.T_USER_BETS)
                .select('id', 'bet_id')
                // @ts-ignore
                .where({bet_id: bet.id});


            console.log('Bet_users list:', betsUserByBetID);
            if (betsUserByBetID.length > 0) {
                betsUserByBetID.map(async (user_bet) => {
                    await knex(process.env.T_USER_BETS)
                        .where({bet_id: user_bet.id})
                        .update({
                            status: isWinner,
                            update_at: knex.fn.now()
                        });
                    if (isWinner === 'won') {
                        console.log('user bet id:', user_bet.user_id);
                        await knex(process.env.T_TRANSACTIONS)
                            .insert({
                                user_id: user_bet.user_id,
                                // @ts-ignore
                                amount: user_bet.amount * user_bet.odd,
                                category: 'winning',
                                status: 'active',
                                user_bet_id: user_bet.id
                            });
                        console.log('Transaction inserted:');
                    }
                });
            }
        });








    return {statusCode: 201, message: 'Event status updated'}
}


// betsByEventID.map(async (bet) => {
//     // @ts-ignore
//     const isWinner = bet.bet_option === body.option ? 'won' : 'lost';
//
//
//     await knex(process.env.T_BETS)
//         .where({event_id: Number(event_id)})
//         .update({
//             // @ts-ignore
//             status: body.status,
//             result: isWinner,
//             update_at: knex.fn.now()
//         });
//     console.log('bet name:', bet.name );
//     console.log('is winner option:', isWinner);
//     console.log('event_id:', event_id)
//     console.log('bet_id:', bet.id);
//
//     const betsUserByBetID = await knex(process.env.T_USER_BETS)
//         .select('id', 'bet_id')
//         .where({bet_id: bet.id});
//
//
//     console.log('Bet_users list:', betsUserByBetID);
//     if (betsUserByBetID.length > 0) {
//         betsUserByBetID.map(async (user_bet) => {
//             await knex(process.env.T_USER_BETS)
//                 .where({bet_id: user_bet.id})
//                 .update({
//                     status: isWinner,
//                     update_at: knex.fn.now()
//                 });
//             if (isWinner === 'won') {
//                 console.log('user bet id:', user_bet.user_id);
//                 await knex(process.env.T_TRANSACTIONS)
//                     .insert({
//                         user_id: user_bet.user_id,
//                         // @ts-ignore
//                         amount: user_bet.amount * user_bet.odd,
//                         category: 'winning',
//                         status: 'active',
//                         user_bet_id: user_bet.id
//                     });
//                 console.log('Transaction inserted:');
//             }
//         });
//     }
// })