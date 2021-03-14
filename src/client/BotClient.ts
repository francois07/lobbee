import {
  AkairoClient,
  AkairoOptions,
  CommandHandler,
  CommandHandlerOptions,
  ListenerHandler,
  AkairoHandlerOptions,
} from "discord-akairo";
import { ClientOptions } from "discord.js";
import CustomMongooseProvider from "../providers/CustomMongooseProvider";
import { Lobby } from "../models/Lobby";
import { TemporaryChannel } from "../models/TemporaryChannel";

declare module "discord-akairo" {
  interface AkairoClient {
    commandHandler: CommandHandler;
    lobbies: CustomMongooseProvider;
    tempChannels: CustomMongooseProvider;
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
}

export class BotClient extends AkairoClient {
  public botOptions: BotOptions;
  public lobbies: CustomMongooseProvider;
  public tempChannels: CustomMongooseProvider;
  public commandHandler: CommandHandler;
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
      prefix: botOptions.prefix || "%",
      defaultCooldown: 5e3,
    });

    this.listenerHandler = new ListenerHandler(this, {
      directory: botOptions.listenerOptions.directory,
    });

    this.lobbies = new CustomMongooseProvider(Lobby, "lobbies");
    this.tempChannels = new CustomMongooseProvider(
      TemporaryChannel,
      "tempChannels"
    );
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
    await this.tempChannels.init();
    await this.init();
    return this.login(token);
  }
}
