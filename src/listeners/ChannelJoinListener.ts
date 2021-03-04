import { Listener } from "discord-akairo";
import { VoiceState } from "discord.js";
import { LobbyObject } from "../models/Lobby";

export default class ChannelJoinListener extends Listener {
  public constructor() {
    super("voiceStateUpdate", {
      emitter: "client",
      event: "voiceStateUpdate",
      category: "client",
    });
  }

  private async handleNewState(state: VoiceState): Promise<void> {
    const channel = state.channel;
    if (!channel) return;
    const channelData: LobbyObject = await this.client.lobbies.get(
      channel.guild.id,
      "lobbies",
      channel.id,
      undefined
    );
    if (channelData) {
      const newChannel = await channel.guild.channels.create(
        channelData.creationName,
        {
          userLimit: channelData.creationUserLimit || 0,
          parent: channelData.creationParent || channel.parentID || undefined,
          type: "voice",
        }
      );
      await state.setChannel(newChannel.id, "New temporary channel");
      this.client.tempChannels.push(newChannel.id);
    }
  }

  private async handleOldState(state: VoiceState): Promise<void> {
    const channel = state.channel;
    if (!channel) return;
    if (
      this.client.tempChannels.includes(channel.id) &&
      channel!.members.size < 1
    ) {
      await channel.delete("Empty temporary channel").catch((e) => {
        throw e;
      });
    }
  }

  public async exec(oldState: VoiceState, newState: VoiceState): Promise<void> {
    try {
      await this.handleNewState(newState);
      await this.handleOldState(oldState);
    } catch (err) {
      throw err;
    }
  }
}
