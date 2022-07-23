import { createBelClient } from "discord-bel";
import { GatewayIntentBits } from "discord.js";
import { redis } from "./db";

redis.on("error", (err) => console.error(err));

const { client: discordClient, commands } = createBelClient(
  process.env.DISCORD_TOKEN!,
  {
    commandsPath: __dirname + "/commands",
    listenersPath: __dirname + "/listeners",
    clientId: process.env.CLIENT_ID!,
    intents: [GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.Guilds],
  }
);

discordClient.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  const cmd = commands.get(commandName);

  if (cmd) {
    cmd.run(interaction);
  }
});

discordClient.login(process.env.DISCORD_TOKEN!);
