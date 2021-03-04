import { Listener, Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

export default class CooldownListener extends Listener {
  public constructor() {
    super("cooldownListener", {
      emitter: "commandHandler",
      event: "cooldown",
      category: "client",
    });
  }

  public exec(message: Message, command: Command, remaining: number): void {
    message.channel
      .send({
        embed: new MessageEmbed()
          .setTitle("Cooldown")
          .setDescription(
            `<@${message.author.id}>, please wait \`\`${
              remaining / 1000
            }\`\`s before using this command again`
          )
          .setColor(0xf54e42),
      })
      .catch((e) => {
        throw e;
      });
  }
}
