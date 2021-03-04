import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

export default class HelpCommand extends Command {
  public constructor() {
    super("help", {
      aliases: ["help", "h"],
      category: "Public",
      clientPermissions: ["SEND_MESSAGES"],
      description: {
        content: "Get informations about my commands",
        usage: "help (optional)<commandName>",
        examples: ["help", "help lobby"],
      },
      args: [
        {
          id: "commandName",
          type: "string",
          default: null,
        },
      ],
    });
  }

  private getSpecificCommandEmbed(commandName: string): MessageEmbed {
    const command = this.client.commandHandler.findCommand(commandName) || null;
    if (command && command.categoryID !== "Private") {
      return new MessageEmbed()
        .setTitle(`About ${command.id}`)
        .setDescription(command.description.content)
        .addField(
          "Aliases",
          command.aliases.map((a: string) => `\`\`${a}\`\``).join(", ")
        )
        .addField("Usage", ` \`\`${command.description.usage}\`\``)
        .addField(
          "Examples",
          command.description.examples
            .map((ex: string) => `\`\`${ex}\`\``)
            .join("\n")
        );
    } else {
      throw new Error("🔍 This command does not exist");
    }
  }

  private getGeneralEmbed(): MessageEmbed {
    let embed = new MessageEmbed()
      .setTitle(`${this.client.user?.username}'s commands`)
      .setDescription(
        `Need some support? [Join the discord server](https://discord.gg/cUqkP7RNdF)`
      );
    this.client.commandHandler.modules
      .filter((m) => m.categoryID !== "Private")
      .forEach((command) =>
        embed.addField(
          command.id.toUpperCase(),
          command.description.content +
            "\n" +
            `__Usage__ \`\`${command.description.usage}\`\``
        )
      );
    return embed;
  }

  public exec(message: Message, args: any): MessageEmbed {
    let embed: MessageEmbed = args.commandName
      ? this.getSpecificCommandEmbed(args.commandName)
      : this.getGeneralEmbed();
    return embed.setThumbnail(this.client.user?.avatarURL() || "");
  }
}
