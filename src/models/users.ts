import knex from '../database/db';
// @ts-ignore
import bcrypt from 'bcrypt';

export type  User = {
    role?: string,
    first_name?: string,
    last_name?: string,
    phone?: string,
    email?: string,
    password?: string,
    username?: string,
    address?: string,
    gender?: string,
    birth_date?: string,
    country_id?: string,
    city?: string,
    category?: string,
    document_id: string,
    user_state?: string,
};

export const addUser = async (user: User) => {

    return await knex(process.env.T_USERS).insert({
        role: user.role,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        email: user.email,
        username: user.username,
        address: user.address,
        gender: user.gender,
        birth_date: user.birth_date,
        country_id: user.country_id,
        city: user.city,
        category: user.category,
        document_id: user.document_id,
        user_state: user.user_state,
    })
    .returning('id')
    .then(async (id) => {
        console.log('id: ',id);
        // @ts-ignore
        const insertedUser = await getUser(id);

        if (insertedUser.statusCode !== 200) {
            return insertedUser;
        }

        // @ts-ignore
        bcrypt.hash(user.password, Number(process.env.B_SALTS), async (err, hash) => {
            // Store hash in your password DB.
            await knex(process.env.T_ACCESS).insert({
                user_id: id,
                email: user.email,
                username: user.username,
                password: hash,
            });
        });

        return {statusCode: 201, message: 'User registration done'};
    });
}

export const checkLoginFields = async (user: User) => {
    if (!user.email && !user.username) {
        return {statusCode: 400, message: 'Email or Username is required'};
    }
    if (!user.password) {
        return {statusCode: 400, message: 'Password is required'};
    }

    const userByEmail = await knex(process.env.T_ACCESS) // validate by email
        .where({email: user.email})
        .select('*');
    if (userByEmail && userByEmail.length > 0) {
        const res = bcrypt.compareSync(user.password, userByEmail[0].password);

        if (res === true) {
            return {statusCode: 200, message: 'User was validated successfully'};
        }
        return {statusCode: 401, message: 'Password is incorrect'};
    }

    const userByUsername = await knex(process.env.T_ACCESS) // validate by username
        .where({username: user.username})
        .select('*');
    if (userByUsername && userByUsername.length > 0) {
        // @ts-ignore
        const res = bcrypt.compareSync(user.password, userByUsername[0].password);

        if (res === true) {
            return {statusCode: 200, message: 'User was validated successfully'};
        }
        return {statusCode: 401, message: 'Password is incorrect'};
    }
    return {statusCode: 404, message: 'Email or username not found'};
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
        return {statusCode: 200, event: userResults[0], message: 'User was found'};
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