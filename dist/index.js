"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config({ path: __dirname + "/.env" });
const mongoose = require("mongoose");
const path_1 = require("path");
const BotClient_1 = __importDefault(require("./client/BotClient"));
const Lobby_1 = __importDefault(require("./models/Lobby"));
const client = new BotClient_1.default({
    commandOptions: { directory: path_1.join(__dirname, "commands") },
    listenerOptions: { directory: path_1.join(__dirname, "listeners") },
    prefix: "%",
    model: Lobby_1.default,
}, { ownerID: process.env.OWNER_ID }, { disableMentions: "everyone" });
mongoose
    .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
})
    .then(() => {
    console.log("✅ Connected to database");
    client.start(process.env.BOT_TOKEN);
})
    .catch((err) => console.log(err));
