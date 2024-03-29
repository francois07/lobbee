import { createBelListener } from "discord-bel";
import { redis } from "../db";

const ReadyListener = createBelListener({
  name: "ready",
  run: async (client) => {
    console.log(`Connected as ${client.user.username}`);
    await redis.connect().catch((err) => console.error(err));
  },
});

export default ReadyListener;
