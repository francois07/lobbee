import { Listener } from "discord-akairo";
import { VoiceState, Collection } from "discord.js";
import { LobbyObject } from "../models/Lobby";

export default class ChannelJoinListener extends Listener {
  public tempChannels: Array<string>;

  public constructor() {
    super("voiceStateUpdate", {
      emitter: "client",
      event: "voiceStateUpdate",
      category: "client",
    });
    this.tempChannels = [];
  }

  public async exec(oldState: VoiceState, newState: VoiceState): Promise<void> {
    if (newState.channel) {
      const channelData: LobbyObject = await this.client.lobbies?.get(
        newState.guild.id,
        "lobbies",
        newState.channel.id,
        undefined
      );
      if (channelData) {
        newState.guild.channels
          .create(channelData.creationName, {
            userLimit: channelData.creationUserLimit || 0,
            parent: channelData.creationParent || newState.channel.parentID!,
            type: "voice",
          })
          .then((newChannel) => {
            console.log(newChannel.name);
            newState
              .setChannel(newChannel.id, "New temporary channel")
              .catch((_) => newChannel.delete())
              .catch((err) => {
                throw err;
              });
            this.tempChannels.push(newChannel.id);
          });
      }
    }
    if (oldState.channel) {
      const tempChannel: boolean = this.tempChannels.includes(
        oldState.channel.id
      );

      if (tempChannel && oldState.channel.members.size < 1) {
        oldState.channel.delete("Deleted temporary channel");
      }
    }
  }
}
