import { Listener } from "discord-akairo";
import { VoiceState } from "discord.js";
import { LobbyObject } from "../models/Lobby";
import { TemporaryChannelObject } from "../models/TemporaryChannel";

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
    const channelData: LobbyObject | undefined = await this.client.lobbies.get(
      channel.guild.id,
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
      try {
        await state.setChannel(newChannel.id, "New temporary channel");
        await this.client.tempChannels.set(channel.guild.id, newChannel.id, {
          creatorId: channel.id,
        });
      } catch (e) {
        newChannel.delete("Error");
        throw new Error("Error when creating temporary channel");
      }
    }
  }

  private async handleOldState(state: VoiceState): Promise<void> {
    const channel = state.channel;
    if (!channel) return;
    const channelData:
      | TemporaryChannelObject
      | undefined = await this.client.tempChannels.get(
      channel.guild.id,
      channel.id,
      undefined
    );
    if (channelData && channel.members.size < 1) {
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
