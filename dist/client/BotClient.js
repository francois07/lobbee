"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
const CustomMongooseProvider_1 = __importDefault(require("../providers/CustomMongooseProvider"));
class BotClient extends discord_akairo_1.AkairoClient {
    constructor(botOptions, akairoOptions, discordjsOptions) {
        super(akairoOptions, discordjsOptions);
        this.botOptions = botOptions;
        this.commandHandler = new discord_akairo_1.CommandHandler(this, {
            directory: botOptions.commandOptions.directory,
            prefix: botOptions.prefix || "!",
        });
        this.listenerHandler = new discord_akairo_1.ListenerHandler(this, {
            directory: botOptions.listenerOptions.directory,
        });
        this.lobbies = new CustomMongooseProvider_1.default(botOptions.model);
    }
    init() {
        this.commandHandler.useListenerHandler(this.listenerHandler);
        this.listenerHandler.setEmitters({
            commandHandler: this.commandHandler,
            listenerHandler: this.listenerHandler,
            process,
        });
        this.commandHandler.loadAll();
        this.listenerHandler.loadAll();
    }
    start(token) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.lobbies.init();
            yield this.init();
            return this.login(token);
        });
    }
}
exports.default = BotClient;
