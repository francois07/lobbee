import { createBelClient } from "discord-bel";

const { client, commands } = createBelClient(process.env.DISCORD_TOKEN!, {
  commandsPath: __dirname + "/commands",
  clientId: process.env.CLIENT_ID!,
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  const cmd = commands.get(commandName);

  if (cmd) {
    cmd.run(interaction);
  }
});

client.login(process.env.DISCORD_TOKEN!);
