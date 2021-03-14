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
          "Use this command if for some reason some empty temporary channels were not deleted",
        usage: "lobbeeclear",
        examples: ["lobbeeclear"],
      },
      clientPermissions: ["MANAGE_CHANNELS", "VIEW_CHANNEL"],
      userPermissions: ["MANAGE_CHANNELS"],
    });
  }

  public async exec(message: Message): Promise<MessageEmbed> {
    const tempChannels = this.client.tempChannels.getAll(message.guild!.id);
    let i = 0;
    if (tempChannels) {
      Object.keys(tempChannels).forEach((channelId) => {
        const channel = message.guild!.channels.resolve(channelId);
        if (channel && channel.members.size < 1) {
          channel.delete().catch((e) => {
            throw e;
          });
          i++;
        } else if (!channel) {
          this.client.tempChannels.delete(message.guild!.id, channelId);
          i++;
        }
      });
    }
    return new MessageEmbed()
      .setTitle("Cleared")
      .setDescription(`Cleared \`\`${i}\`\` temporary channels`);
  }
}
