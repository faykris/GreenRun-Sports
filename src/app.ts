import { Server } from "@hapi/hapi";
import { users } from "./routes/users";
import { transactions } from "./routes/transactions";
import { bets } from "./routes/bets";


export const init = async () => {
    const server = new Server({
        port: process.env.PORT || 3000,
        host: 'localhost'
    });


    users(server);
    transactions(server);
    bets(server);

    await server.start();
    console.log(`Server running on ${server.info.uri}`);
}

process.on('unhandledRejection', err => {
    console.log(err);
    process.exit(1);
});
