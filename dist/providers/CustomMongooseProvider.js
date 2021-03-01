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
const discord_js_1 = require("discord.js");
class MongooseProvider {
    constructor(model) {
        this.model = model;
        this.items = new discord_js_1.Collection();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const guilds = yield this.model.find();
            for (const guild of guilds) {
                this.items.set(guild.id, guild);
            }
        });
    }
    get(id, category, key, defaultValue) {
        var _a, _b;
        if (this.items.has(id)) {
            const value = (_b = (_a = this.items.get(id)) === null || _a === void 0 ? void 0 : _a[category]) === null || _b === void 0 ? void 0 : _b[key];
            return value || defaultValue;
        }
        return defaultValue;
    }
    set(id, category, key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = this.items.get(id) || { [category]: {} };
            data[category][key] = value;
            this.items.set(id, data);
            const doc = yield this.getDocument(id);
            doc[category][key] = value;
            doc.markModified(category);
            return doc.save();
        });
    }
    delete(id, category, key) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const data = ((_a = this.items.get(id)) === null || _a === void 0 ? void 0 : _a[category]) || {};
            delete data[key];
            const doc = yield this.getDocument(id);
            delete doc[category][key];
            doc.markModified(category);
            return doc.save();
        });
    }
    clear(id) {
        return __awaiter(this, void 0, void 0, function* () {
            this.items.delete(id);
            const doc = yield this.getDocument(id);
            if (doc)
                yield doc.remove();
        });
    }
    getDocument(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const obj = yield this.model.findOne({ id });
            if (!obj) {
                // eslint-disable-next-line new-cap
                const newDoc = yield new this.model({ id }).save();
                return newDoc;
            }
            return obj;
        });
    }
}
exports.default = MongooseProvider;
