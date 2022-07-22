import { createBelClient } from "discord-bel";
import redis from "redis";

const redisClient = redis.createClient({
  url: process.env.REDIS_URL!,
});

const { client: discordClient, commands } = createBelClient(
  process.env.DISCORD_TOKEN!,
  {
    commandsPath: __dirname + "/commands",
    clientId: process.env.CLIENT_ID!,
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
