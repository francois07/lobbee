import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

export default class CheckLobbyCommand extends Command {
  public constructor() {
    super("checklobbys", {
      aliases: ["checklobbys"],
      category: "Public",
      channel: "guild",
      description: {
        content: "Check the lobby creators on this server",
        usage: "checklobbys",
        examples: ["checklobbys"],
      },
      userPermissions: ["MANAGE_CHANNELS"],
      clientPermissions: ["SEND_MESSAGES"],
    });
  }

  public async exec(message: Message): Promise<MessageEmbed> {
    const lobbyData: Object = await this.client.lobbies.getAll(
      message.guild!.id
    );
    if (!lobbyData) {
      throw new Error("🔍 I couldn't find any creator on this server");
    }
    const creators = Object.keys(lobbyData);
    const description = `There are \`\`${creators.length}\`\` creators on this server`;
    const creatorsName = await Promise.all(
      creators.map(async (id: string) => {
        const channel = await message.guild!.channels.resolve(id);
        return `\`\`${channel?.name}\`\``;
      })
    ).catch((e) => {
      throw e;
    });

    return new MessageEmbed()
      .setTitle(`Creators on ${message.guild!.name}`)
      .setDescription(`${description}\n${creatorsName.join(", ")}`);
  }
}
