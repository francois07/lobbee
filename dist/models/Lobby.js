"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lobby = void 0;
const mongoose_1 = require("mongoose");
const lobbySchema = new mongoose_1.Schema({
    id: {
        type: String,
        required: true,
    },
    lobbies: {
        type: Object,
        default: {},
    },
}, { minimize: false });
exports.Lobby = mongoose_1.model("Lobby", lobbySchema);
