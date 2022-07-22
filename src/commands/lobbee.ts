import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

const LobbeeCommand = {
  name: "lobbee",
  builder: new SlashCommandBuilder()
    .setName("lobbee")
    .setDescription("Defines an existings channel as a lobby creator")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to define as a lobby creator")
    )
    .addStringOption((option) =>
      option.setName("createdName").setDescription("The created lobbies' name")
    )
    .addBooleanOption((option) =>
      option
        .setName("numbered")
        .setDescription("Wether or not the created lobbies should be numbered")
    )
    .addIntegerOption((option) =>
      option
        .setName("userLimit")
        .setDescription("The created lobbies' user limit")
    ),
  run: (interaction: ChatInputCommandInteraction) => {
    console.log(interaction.options.data);
  },
};

export default LobbeeCommand;
