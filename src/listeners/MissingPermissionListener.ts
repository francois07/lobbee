import { Listener, Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

export default class ChannelDeleteListener extends Listener {
  public constructor() {
    super("missingPermissions", {
      emitter: "commandHandler",
      event: "missingPermissions",
      category: "client",
    });
  }

  public async exec(
    message: Message,
    command: Command,
    type: string,
    missing: Array<string>
  ): Promise<void> {
    const embed = new MessageEmbed()
      .setTitle("Missing permissions")
      .setDescription(
        `<@${message.author.id}>, ${
          type === "user" ? "You are" : "I am"
        } missing permissions: ${missing.map((m) => "``" + m + "``").join(" ")}`
      )
      .setColor(0xf54e42);
    try {
      if (!missing.includes("SEND_MESSAGES")) {
        await message.channel.send({
          embed: embed,
        });
      } else {
        await message.author.send({ embed: embed });
      }
    } catch (e) {
      throw e;
    }
  }
}
