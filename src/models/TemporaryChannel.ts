import { Schema, model } from "mongoose";
import { Channel } from "discord.js";

export interface TemporaryChannelObject {
  creatorId: string;
}

const tempChannelSchema = new Schema(
  {
    id: {
      type: "string",
      required: true,
    },
    tempChannels: {
      type: Object,
      default: {},
    },
  },
  { minimize: false }
);

export const TemporaryChannel = model("TemporaryChannel", tempChannelSchema);
