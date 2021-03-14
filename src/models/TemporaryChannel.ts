import { Schema, model } from "mongoose";

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
