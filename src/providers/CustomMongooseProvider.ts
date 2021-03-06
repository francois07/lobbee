import { Model } from "mongoose";
import { MongooseProvider } from "discord-akairo";

export default class CustomMongooseProvider extends MongooseProvider {
  public document: string;

  constructor(model: Model<any>, document: string) {
    super(model);
    this.document = document;
  }

  public async init() {
    const guilds = await this.model.find();
    for (const guild of guilds) {
      this.items.set(guild.id, guild);
    }
  }

  public get(id: string, key: string, defaultValue: any) {
    if (this.items.has(id)) {
      const value = this.items.get(id)?.[this.document]?.[key];
      return value || defaultValue;
    }

    return defaultValue;
  }

  public async set(id: string, key: string, value: any) {
    const data = this.items.get(id) || { [this.document]: {} };
    data[this.document][key] = value;
    this.items.set(id, data);

    const doc = await this.getDocument(id);
    doc[this.document][key] = value;
    doc.markModified(this.document);
    return doc.save();
  }

  async delete(id: string, key: string) {
    const data = this.items.get(id)?.[this.document] || {};
    delete data[key];

    const doc = await this.getDocument(id);
    delete doc[this.document][key];
    doc.markModified(this.document);
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
