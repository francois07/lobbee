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
const discord_akairo_1 = require("discord-akairo");
class LobbeeCommand extends discord_akairo_1.Command {
    constructor() {
        super("lobbee", {
            aliases: ["lobbee", "lobby"],
            category: "Lobby",
            channel: "guild",
            description: {
                content: "Defines an existings channel as a lobby creator",
                usage: 'lobby <channelID> "<created channel name">',
                examples: ['lobby 815661281238974516 "Lobby 1v1"'],
            },
            args: [
                {
                    id: "channelId",
                    type: "string",
                },
                {
                    id: "creationName",
                    type: "string",
                },
                {
                    id: "parent",
                    type: "string",
                    match: "option",
                    flag: "parent:",
                    default: null,
                },
                {
                    id: "userLimit",
                    type: "number",
                    match: "option",
                    flag: "userLimit:",
                    default: 0,
                },
            ],
        });
    }
    exec(message, args) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(args);
            if (message.guild) {
                yield this.client.lobbies.set(message.guild.id, "lobbies", args.channelId, {
                    creationName: args.creationName,
                    creationParent: args.parent,
                    creationUserLimit: args.userLimit,
                });
            }
        });
    }
}
exports.default = LobbeeCommand;
