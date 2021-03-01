import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { LobbyObject } from "../models/Lobby";

export default class LobbeeCommand extends Command {
  constructor() {
    super("lobbee", {
      aliases: ["lobbee", "lobby"],
      category: "Lobby",
      channel: "guild",
      description: {
        content: "Defines an existings channel as a lobby creator",
        usage: 'lobby <channelID> "<created channel name">',
        examples: ['lobby 815661281238974516 "Lobby 1v1"'],
      },
      args: [
        {
          id: "channelId",
          type: "string",
        },
        {
          id: "creationName",
          type: "string",
        },
        {
          id: "parent",
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

  public async exec(message: Message, args: any): Promise<void> {
    console.log(args);
    if (message.guild) {
      await this.client.lobbies.set(
        message.guild.id,
        "lobbies",
        args.channelId,
        {
          creationName: args.creationName,
          creationParent: args.parent,
          creationUserLimit: args.userLimit,
        }
      );
    }
  }
}
