import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export default {
  name: "ping",
  builder: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Ping command with a twist !")
    .addStringOption((option) =>
      option
        .setName("input")
        .setDescription("What the bot will reply to you")
        .setMaxLength(15)
    ),
  run: (interaction: ChatInputCommandInteraction) => {
    const str = interaction.options.getString("input");
    interaction.reply({ content: str, ephemeral: true });
  },
};
