import { Listener } from "discord-akairo";
import { DMChannel, GuildChannel } from "discord.js";

export default class ChannelDeleteListener extends Listener {
  public constructor() {
    super("channelDelete", {
      emitter: "client",
      event: "channelDelete",
      category: "client",
    });
  }

  public exec(channel: DMChannel | GuildChannel): void {
    if (channel.type !== "voice") return;
    if (this.client.tempChannels.includes(channel.id)) {
      this.client.tempChannels = this.client.tempChannels.filter(
        (c) => c !== channel.id
      );
    } else {
      const creatorChannel = this.client.lobbies.get(
        channel.guild.id,
        "lobbies",
        channel.id,
        undefined
      );
      if (creatorChannel) {
        this.client.lobbies.delete(channel.guild.id, "lobbies", channel.id);
      }
    }
  }
}
