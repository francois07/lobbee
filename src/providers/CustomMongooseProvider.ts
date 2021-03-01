import { Model } from "mongoose";
import { Collection } from "discord.js";

export default class MongooseProvider {
  public model: Model<any>;
  public items: Collection<string, any>;

  constructor(model: Model<any>) {
    this.model = model;
    this.items = new Collection();
  }

  public async init() {
    const guilds = await this.model.find();
    for (const guild of guilds) {
      this.items.set(guild.id, guild);
    }
  }

  public get(id: string, category: string, key: string, defaultValue: any) {
    if (this.items.has(id)) {
      const value = this.items.get(id)?.[category]?.[key];
      return value || defaultValue;
    }

    return defaultValue;
  }

  public async set(id: string, category: string, key: string, value: any) {
    const data = this.items.get(id) || { [category]: {} };
    data[category][key] = value;
    this.items.set(id, data);

    const doc = await this.getDocument(id);
    doc[category][key] = value;
    doc.markModified(category);
    return doc.save();
  }

  async delete(id: string, category: string, key: string) {
    const data = this.items.get(id)?.[category] || {};
    delete data[key];

    const doc = await this.getDocument(id);
    delete doc[category][key];
    doc.markModified(category);
    return doc.save();
  }

  async clear(id: string) {
    this.items.delete(id);
    const doc = await this.getDocument(id);
    if (doc) await doc.remove();
  }

  async getDocument(id: string) {
    const obj = await this.model.findOne({ id });
    if (!obj) {
      // eslint-disable-next-line new-cap
      const newDoc = await new this.model({ id }).save();
      return newDoc;
    }

    return obj;
  }
}
