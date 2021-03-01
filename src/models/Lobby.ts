import { Schema, model } from "mongoose";

export interface LobbyObject {
  creationName: string;
  creationUserLimit?: number;
  creationParent?: string;
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
