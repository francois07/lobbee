import { createBelListener } from "discord-bel";
import { ChannelType, VoiceState } from "discord.js";
import { redis, prisma } from "../db";

const voiceStateUpdateListener = createBelListener(
  {
    name: "voiceStateUpdate",
    run: async (oldState: VoiceState, newState: VoiceState) => {
      const tempChannels =
        (await redis
          .SMEMBERS("temp_channels")
          .catch((err) => console.error(err))) ?? [];

      /* Handle newState */
      try {
        const newChannel = newState.channel;
        if (newChannel) {
          const channelCreator = await prisma.channel_creator.findFirst({
            where: {
              channel_discord_id: newChannel.id,
            },
          });

          if (channelCreator) {
            const createdChannel = await newChannel.guild.channels.create({
              name: channelCreator.created_name,
              type: ChannelType.GuildVoice,
              parent: newChannel.parent,
            });

            await redis.SADD("temp_channels", createdChannel.id);
            await newState.setChannel(createdChannel.id);
          }
        }
      } catch (err) {
        console.error(err);
      }

      /* Handle oldState */
      try {
        const oldChannel = oldState.channel;
        if (oldChannel) {
          const isTempChannel = tempChannels.includes(oldChannel.id);
          if (isTempChannel && oldChannel.members.size < 1) {
            await oldChannel.delete("Empty temporary channel");
            await redis.SREM("temp_channels", oldChannel.id);
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
  },
);

export default voiceStateUpdateListener;
