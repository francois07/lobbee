import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import validator from "validator";

export default class LobbeeCommand extends Command {
  constructor() {
    super("lobbee", {
      aliases: ["lobbee", "lobby"],
      category: "Public",
      channel: "guild",
      description: {
        content:
          "Defines an existings channel as a lobby creator. Use quotation marks if you want the created channel to have spaces in its name.",
        usage:
          'lobby <channelID> "<createdName>" (optional)userLimit:<userLimit> (optional)parent:<parentId>',
        examples: [
          'lobby 815661281238974516 "Lobby 1v1"',
          'lobby 768833379881189438 "Lobby 1v1" userLimit:3',
          'lobby 768833379499114516 "Lounge" parent:804912642573598781',
        ],
      },
      clientPermissions: ["MANAGE_CHANNELS", "MOVE_MEMBERS"],
      userPermissions: ["MANAGE_CHANNELS"],
      args: [
        {
          id: "channelId",
          type: "string",
          prompt: {
            start: (message: Message) =>
              new MessageEmbed()
                .setDescription("What is the creator channel's id?")
                .setColor(0xffaa2b),
          },
        },
        {
          id: "creationName",
          type: "string",
          prompt: {
            start: (message: Message) =>
              new MessageEmbed()
                .setDescription(
                  "What name do you want the temporary channels to have?"
                )
                .setColor(0xffaa2b),
          },
        },
        {
          id: "parentId",
          type: "string",
          match: "option",
          flag: "parent:",
          default: null,
        },
        {
          id: "userLimit",
          type: "number",
          match: "option",
          flag: "userLimit:",
          default: 0,
        },
      ],
    });
  }

  private async isValidCreator(creatorId: string): Promise<boolean> {
    const creatorChannel = await this.client.channels
      .fetch(creatorId)
      .catch((e) => null);
    if (creatorChannel) {
      return creatorChannel.type === "voice";
    } else {
      return false;
    }
  }

  private async isValidParent(parentId: string): Promise<boolean> {
    const parentChannel = await this.client.channels
      .fetch(parentId)
      .catch((e) => null);
    if (parentChannel) {
      return parentChannel.type === "category";
    } else {
      return false;
    }
  }

  public async exec(message: Message, args: any): Promise<MessageEmbed> {
    try {
      const isValidChannel = await this.isValidCreator(args.channelId);
      const isValidParent = args.parentId
        ? await this.isValidParent(args.parentId)
        : true;
      const isValidCreationName = args.creationName
        ? validator.isLength(args.creationName, { max: 50, min: 1 })
        : true;

      if (!isValidChannel)
        throw new Error(
          `\`\`${args.channelId}\`\` is not a valid voice channel ID 😔`
        );

      if (!isValidParent)
        throw new Error(
          `\`\`${args.parentId}\`\` is not a valid category ID 😔`
        );

      if (!isValidCreationName)
        throw new Error(
          `\`\`${args.parentId}\`\` is not a valid lobby name 😔\nPlease make sure that the name length is between \`\`1\`\` and \`\`50\`\``
        );

      await this.client.lobbies.set(
        message.guild!.id,
        "lobbies",
        args.channelId,
        {
          creationName: args.creationName,
          creationParent: args.parentId,
          creationUserLimit: args.userLimit,
        }
      );

      const channelName = await message.guild!.channels.resolve(args.channelId)
        ?.name;
      const parentName = args.parentId
        ? await message.guild!.channels.resolve(args.parentId)?.name
        : null;
      const optionalString =
        "with " +
        (args.userLimit ? `a limit of ${args.userLimit} users` : `no limit`) +
        (args.parentId ? ` and \`\`${parentName}\`\` as its parent` : "");

      return new MessageEmbed()
        .setTitle("New lobby creator")
        .setDescription(
          `Set \`\`${channelName}\`\` as a creator of \`\`${args.creationName}\`\`` +
            optionalString
        );
    } catch (e) {
      throw e;
    }
  }
}
