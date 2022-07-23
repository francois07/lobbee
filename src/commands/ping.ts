import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

const PingCommand = {
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
    console.log(interaction.options.data);
    interaction.reply({ content: str, ephemeral: true });
  },
};

export default PingCommand;
