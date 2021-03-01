"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const path_1 = require("path");
const BotClient_1 = require("./client/BotClient");
const Lobby_1 = require("./models/Lobby");
const client = new BotClient_1.BotClient({
    commandOptions: { directory: path_1.join(__dirname, "commands") },
    listenerOptions: { directory: path_1.join(__dirname, "listeners") },
    prefix: "%",
    model: Lobby_1.Lobby,
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
