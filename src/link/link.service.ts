import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import { Model } from 'mongoose';
import { ILink } from 'src/models/link.model';
import { LinkDocument } from 'src/schemas/link.schema';
import { parse } from 'node-html-parser';
import * as shortid from 'shortid';
import { InjectBot } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { UserLocationDto } from './dto/location.dto';
import { SubscribeDto } from './dto/subscribe.dto';
import { IHistory } from 'src/models/history.model';
import { HistoryDocument } from 'src/schemas/history.schema';

@Injectable()
export class LinkService {
  constructor(
    @InjectModel(ILink.name) private linkModel: Model<LinkDocument>,
    @InjectModel(IHistory.name) private historyModel: Model<HistoryDocument>,
    @InjectBot() private bot: Telegraf<Context>,
  ) {}

  async create(url: string, userId?: number): Promise<ILink> {
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
      createdAt: Date.now(),
      updatedAt: Date.now(),
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
    try {
      const link = await this.linkModel.findOne({ shortId });
      if (!link) {
        return null;
      }

      const clearIp = ip.split(':');
      const { data } = await axios.get<UserLocationDto>(
        `https://ipwho.is/${clearIp[clearIp.length - 1]}`,
      );

      new this.historyModel({
        location: data,
        visitedAt: Date.now(),
        shortId: link.shortId,
        userId: link.userId,
      }).save();

      link.views++;
      link.save();

      if (link.isSub && link.userId) {
        this.bot.telegram.sendMessage(
          link.userId,
          `По вашей ссылке прошли!\n🗺️ Место: \`${data.city}\`, \`${data.country}\` (IP = \`${data.ip}\`)\n ` +
            `📱💻 Устройство:\n\`${userAgent}\`\n🔗 Ссылка: ${process.env.HOST}/${shortId}`,
          {
            parse_mode: 'Markdown',
            disable_web_page_preview: true,
          },
        );
        await this.bot.telegram.sendLocation(
          link.userId,
          data.latitude,
          data.longitude,
        );
      }

      return link.url;
    } catch (error) {
      console.log(error);
    }
  }

  async subscribeUserToLinkByLink(shortId: string): Promise<SubscribeDto> {
    const link = await this.linkModel.findOne({ shortId });
    if (link) {
      await this.linkModel.updateOne(
        { shortId },
        { $set: { isSub: !link.isSub, updatedAt: Date.now() } },
      );
      return { result: true, state: !link.isSub };
    }

    return { result: false, state: null };
  }
}
