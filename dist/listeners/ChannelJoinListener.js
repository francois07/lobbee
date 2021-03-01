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
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
class ChannelJoinListener extends discord_akairo_1.Listener {
    constructor() {
        super("voiceStateUpdate", {
            emitter: "client",
            event: "voiceStateUpdate",
            category: "client",
        });
        this.tempChannels = [];
    }
    exec(oldState, newState) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (newState.channel) {
                const channelData = yield ((_a = this.client.lobbies) === null || _a === void 0 ? void 0 : _a.get(newState.guild.id, "lobbies", newState.channel.id, undefined));
                if (channelData) {
                    newState.guild.channels
                        .create(channelData.creationName, {
                        userLimit: channelData.creationUserLimit || 0,
                        parent: channelData.creationParent || newState.channel.parentID,
                        type: "voice",
                    })
                        .then((newChannel) => {
                        console.log(newChannel.name);
                        newState
                            .setChannel(newChannel.id, "New temporary channel")
                            .catch((_) => newChannel.delete())
                            .catch((err) => {
                            throw err;
                        });
                        this.tempChannels.push(newChannel.id);
                    });
                }
            }
            if (oldState.channel) {
                const tempChannel = this.tempChannels.includes(oldState.channel.id);
                if (tempChannel && oldState.channel.members.size < 1) {
                    oldState.channel.delete("Deleted temporary channel");
                }
            }
        });
    }
}
exports.default = ChannelJoinListener;
