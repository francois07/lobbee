import { Schema, model } from "mongoose";

export interface LobbyObject {
  creationName: string;
  creationParent?: string;
  creationUserLimit?: number;
  creationChannelLimit?: number;
}

const lobbySchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    lobbies: {
      type: Object,
      default: {},
    },
  },
  { minimize: false }
);

export const Lobby = model("Lobby", lobbySchema);
