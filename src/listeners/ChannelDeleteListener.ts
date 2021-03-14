import { Listener } from "discord-akairo";
import { DMChannel, GuildChannel } from "discord.js";
import { TemporaryChannelObject } from "../models/TemporaryChannel";

export default class ChannelDeleteListener extends Listener {
  public constructor() {
    super("channelDelete", {
      emitter: "client",
      event: "channelDelete",
      category: "client",
    });
  }

  public async exec(channel: DMChannel | GuildChannel): Promise<void> {
    if (channel.type !== "voice") return;
    const tempChannel: TemporaryChannelObject = this.client.tempChannels.get(
      channel.guild.id,
      channel.id,
      undefined
    );
    const creatorChannel = this.client.lobbies.get(
      channel.guild.id,
      channel.id,
      undefined
    );
    try {
      if (tempChannel) {
        await this.client.tempChannels.delete(channel.guild.id, channel.id);
      }
      if (creatorChannel) {
        await this.client.lobbies.delete(channel.guild.id, channel.id);
      }
    } catch (e) {
      throw e;
    }
  }
}
