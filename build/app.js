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
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const hapi_1 = require("@hapi/hapi");
const users_1 = require("./routes/users");
const transactions_1 = require("./routes/transactions");
const bets_1 = require("./routes/bets");
const init = () => __awaiter(void 0, void 0, void 0, function* () {
    const server = new hapi_1.Server({
        port: process.env.PORT || 3000,
    });
    (0, users_1.users)(server);
    (0, transactions_1.transactions)(server);
    (0, bets_1.bets)(server);
    yield server.start();
    console.log(`Server running on ${server.info.uri}`);
});
exports.init = init;
process.on('unhandledRejection', err => {
    console.log(err);
    process.exit(1);
});
