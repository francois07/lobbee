import { Command } from "discord-akairo";
import { Message } from "discord.js";

export default class CheckCacheCommand extends Command {
  public constructor() {
    super("cache", {
      aliases: ["cache"],
      category: "Private",
      channel: "guild",
      clientPermissions: ["SEND_MESSAGES"],
      ownerOnly: true,
    });
  }

  public async exec(message: Message): Promise<void> {
    const tempChannels = await this.client.tempChannels.getAll(
      message.guild!.id
    );
    console.log(tempChannels);
  }
}
