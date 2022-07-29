import { BelClient } from "discord-bel";
import { GatewayIntentBits } from "discord.js";
import { redis } from "./db";

redis.on("error", (err) => console.error(err));

const client = new BelClient(
  {
    token: process.env.DISCORD_TOKEN!,
    commandsPath: __dirname + "/commands",
    listenersPath: __dirname + "/listeners",
    clientId: process.env.CLIENT_ID!,
    intents: [GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.Guilds],
  }
);

client.login(process.env.DISCORD_TOKEN!);
