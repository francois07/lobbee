import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

const builder = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Ping command with a twist !")
  .addStringOption((option) =>
    option
      .setName("input")
      .setDescription("What the bot will reply to you")
      .setMaxLength(15)
  )

const run = async (interaction: ChatInputCommandInteraction) => {
  const str = interaction.options.getString("input");
  return interaction.reply({ content: str, ephemeral: true });
}

export { builder, run };
