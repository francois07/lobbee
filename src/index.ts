const mongoose = require("mongoose");
import { join } from "path";
import { BotClient } from "./client/BotClient";

const client = new BotClient(
  {
    commandOptions: { directory: join(__dirname, "commands") },
    listenerOptions: { directory: join(__dirname, "listeners") },
    prefix: "%",
  },
  { ownerID: process.env.OWNER_ID },
  { disableMentions: "everyone" }
);

mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("✅ Connected to database");
    client.start(process.env.BOT_TOKEN);
  })
  .catch((err: Error) => console.log(err));
