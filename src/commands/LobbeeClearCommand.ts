import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

export default class LobbeeCommand extends Command {
  constructor() {
    super("lobbeeclear", {
      aliases: ["lobbeeclear", "clr"],
      category: "Public",
      channel: "guild",
      description: {
        content:
          "Use this command if for some reason empty temporary channels were not deleted",
        usage: "lobbeeclear",
        examples: ["lobbeeclear"],
      },
      clientPermissions: ["MANAGE_CHANNELS", "VIEW_CHANNEL", "SEND_MESSAGES"],
      userPermissions: ["MANAGE_CHANNELS"],
    });
  }

  public async exec(message: Message): Promise<MessageEmbed> {
    const tempChannels: Object = await this.client.tempChannels.getAll(
      message.guild!.id
    );
    let i = 0;
    if (!tempChannels)
      throw new Error(
        "🔍 I couldn't find any empty temporary channel on this server"
      );
    const channelIds = Object.keys(tempChannels);
    for (const id of channelIds) {
      const channelResolved = message.guild!.channels.resolve(id);
      if (channelResolved && channelResolved.members.size < 1) {
        channelResolved.delete().catch((e) => {
          throw e;
        });
        i++;
      } else if (!channelResolved) {
        this.client.tempChannels.delete(message.guild!.id, id).catch((e) => {
          throw e;
        });
        i++;
      }
    }

    return new MessageEmbed()
      .setTitle("Cleared")
      .setDescription(`Cleared \`\`${i}\`\` temporary channels`);
  }
}
