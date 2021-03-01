"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
class PingCommand extends discord_akairo_1.Command {
    constructor() {
        super("ping", {
            aliases: ["ping"],
            category: "Public",
            description: {
                content: "The basic ping command",
                usage: "ping",
                examples: ["ping"],
                rateLimit: 3,
            },
        });
    }
    exec(message) {
        return message.channel.send(`Pong! ${this.client.ws.ping}ms`);
    }
}
exports.default = PingCommand;
