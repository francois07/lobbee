import { Command } from "discord-akairo";
import { Message } from "discord.js";

export default class CheckCacheCommand extends Command {
  public constructor() {
    super("cache", {
      aliases: ["cache"],
      category: "Private",
      clientPermissions: ["SEND_MESSAGES"],
      ownerOnly: true,
    });
  }

  public exec(message: Message): void {
    console.log(this.client.tempChannels);
  }
}
