import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import { Connection, Model } from 'mongoose';
import { ILink } from 'src/models/link.model';
import { LinkDocument } from 'src/schemas/link.schema';
import { parse } from 'node-html-parser';
import * as shortid from 'shortid';

@Injectable()
export class LinkService {
  constructor(
    @InjectConnection() private connection: Connection,
    @InjectModel(ILink.name) private linkModel: Model<LinkDocument>,
  ) {}

  async create(url: string, userId?: number) {
    const root = parse((await axios.get<string>(url)).data);
    const title = root.getElementsByTagName('title')[0].innerText;
    const subTitle = root
      .getElementsByTagName('meta')[0]
      .getAttribute('content');
    const createdLink = new this.linkModel({
      title,
      url,
      shortId: shortid.generate(),
      subTitle,
      userId,
    });
    return createdLink.save();
  }

  async findAll(): Promise<ILink[]> {
    return this.linkModel.find().exec();
  }

  async findLinksByTitle(title: string, userId?: string): Promise<ILink[]> {
    return this.linkModel.find({ $text: { $search: title }, userId }).exec();
  }

  async getLinkById(shortId: string): Promise<string> | null {
    const link = await this.linkModel.findOne({ shortId });

    if (!link) {
      return null;
    }

    link.views++;
    link.save();

    return link.url;
  }
}
