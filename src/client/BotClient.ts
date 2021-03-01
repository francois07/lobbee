import {
  AkairoClient,
  AkairoOptions,
  CommandHandler,
  CommandHandlerOptions,
  ListenerHandler,
  AkairoHandlerOptions,
} from "discord-akairo";
import { ClientOptions } from "discord.js";
import { Model } from "mongoose";
import CustomMongooseProvider from "../providers/CustomMongooseProvider";

declare module "discord-akairo" {
  interface AkairoClient {
    lobbies: CustomMongooseProvider;
  }
}

interface CommandOptions extends CommandHandlerOptions {
  directory: string;
}

interface listenerOptions extends AkairoHandlerOptions {
  directory: string;
}

interface BotOptions {
  commandOptions: CommandOptions;
  listenerOptions: listenerOptions;
  prefix?: string;
  model: Model<any>;
}

export class BotClient extends AkairoClient {
  public botOptions: BotOptions;
  public lobbies: CustomMongooseProvider;
  protected commandHandler: CommandHandler;
  protected listenerHandler: ListenerHandler;

  public constructor(
    botOptions: BotOptions,
    akairoOptions?: AkairoOptions | undefined,
    discordjsOptions?: ClientOptions | undefined
  ) {
    super(akairoOptions, discordjsOptions);
    this.botOptions = botOptions;
    this.commandHandler = new CommandHandler(this, {
      directory: botOptions.commandOptions.directory,
      prefix: botOptions.prefix || "!",
    });
    this.listenerHandler = new ListenerHandler(this, {
      directory: botOptions.listenerOptions.directory,
    });
    this.lobbies = new CustomMongooseProvider(botOptions.model);
  }

  private init(): void {
    this.commandHandler.useListenerHandler(this.listenerHandler);
    this.listenerHandler.setEmitters({
      commandHandler: this.commandHandler,
      listenerHandler: this.listenerHandler,
      process,
    });

    this.commandHandler.loadAll();
    this.listenerHandler.loadAll();
  }

  public async start(token: string | undefined): Promise<string> {
    await this.lobbies.init();
    await this.init();
    return this.login(token);
  }
}
