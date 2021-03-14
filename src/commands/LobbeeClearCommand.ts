import { Command } from "discord-akairo";
import { Message } from "discord.js";

export default class LobbeeCommand extends Command {
  constructor() {
    super("clearlobbee", {
      aliases: ["clearlobbee", "clr"],
      category: "Public",
      channel: "guild",
      description: {
        content:
          "Use this command if for some reason some empty temporary channels were not deleted",
        usage: "clearlobbee",
        examples: ["clearlobbee"],
      },
      clientPermissions: ["MANAGE_CHANNELS", "VIEW_CHANNEL"],
      userPermissions: ["MANAGE_CHANNELS"],
    });
  }

  public async exec(message: Message): Promise<void> {
    const tempChannels = this.client.tempChannels.getAll(message.guild!.id);
    Object.keys(tempChannels).forEach((channelId) => {
      const channel = message.guild!.channels.resolve(channelId);
      if (channel && channel.members.size < 1) {
        channel.delete().catch((e) => {
          throw e;
        });
      } else if (!channel) {
        this.client.tempChannels.delete(message.guild!.id, channelId);
      }
    });
  }
}
