import {
  ChannelType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import { prisma } from "../db";

const LobbeeCommand = {
  name: "lobbee",
  builder: new SlashCommandBuilder()
    .setName("lobbee")
    .setDescription("Create, update & delete lobbies")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("create")
        .setDescription("Defines an existings channel as a lobby creator")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("The channel to define as a lobby creator")
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildVoice)
        )
        .addStringOption((option) =>
          option
            .setName("created_name")
            .setDescription("The created lobbies' name")
            .setRequired(true)
        )
        .addBooleanOption((option) =>
          option
            .setName("numbered")
            .setDescription(
              "Wether or not the created lobbies should be numbered"
            )
        )
        .addIntegerOption((option) =>
          option
            .setName("user_limit")
            .setDescription("The created lobbies' user limit")
        )
    ),
  run: async (interaction: ChatInputCommandInteraction) => {
    const { options } = interaction;

    switch (options.getSubcommand()) {
      case "create":
        const channel = options.getChannel("channel")!;
        const created_name = options.getString("created_name")!;
        const numbered = options.getBoolean("numbered");
        const user_limit = options.getInteger("user_limit");

        await prisma.channel_creator.create({
          data: {
            channel_discord_id: channel.id,
            created_name,
            created_max: user_limit,
            created_numbered: numbered,
          },
        });

        interaction.reply({
          ephemeral: true,
          content: `\`\`${channel.name}\`\` is now a lobby creator. It will create \`\`${created_name}\`\` lobbies 👌`,
        });
        break;
    }
  },
};

export default LobbeeCommand;
