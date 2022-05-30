import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import { Connection, Model } from 'mongoose';
import { ILink } from 'src/models/link.model';
import { LinkDocument } from 'src/schemas/link.schema';
import { parse } from 'node-html-parser';
import * as shortid from 'shortid';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';

@Injectable()
export class LinkService {
  constructor(
    @InjectModel(ILink.name) private linkModel: Model<LinkDocument>,
    @InjectBot() private bot: Telegraf,
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
      isSub: false,
    });
    return createdLink.save();
  }

  async findAll(): Promise<ILink[]> {
    return this.linkModel.find().exec();
  }

  async findAllById(userId: number): Promise<ILink[]> {
    return this.linkModel.find({ userId }).exec();
  }

  async findLinksByTitle(title: string, userId?: string): Promise<ILink[]> {
    return this.linkModel.find({ $text: { $search: title }, userId }).exec();
  }

  async getLinkById(
    shortId: string,
    userAgent: string,
    ip?: string,
  ): Promise<string> | null {
    const link = await this.linkModel.findOne({ shortId });
    if (!link) {
      return null;
    }

    if (link.isSub && link.userId) {
      this.bot.telegram.sendMessage(
        link.userId,
        `По вашей ссылке прошли!\n<strong>IP</strong>: ${ip}\nУстройство:\n<strong>${userAgent}</strong>`,
        {
          parse_mode: 'HTML',
        },
      );
    }

    link.views++;
    link.save();

    return link.url;
  }

  async subscribeUserToLinkByLink(
    shortId: string,
  ): Promise<{ result: boolean; state: boolean }> {
    const link = await this.linkModel.findOne({ shortId });
    if (link) {
      await this.linkModel.updateOne(
        { shortId },
        { $set: { isSub: !link.isSub } },
      );
      return { result: true, state: !link.isSub };
    }

    return { result: false, state: !link.isSub };
  }
}
