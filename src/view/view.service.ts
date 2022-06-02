import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LinkDocument } from 'src/schemas/link.schema';
import { ILink } from 'src/models/link.model';
import { IHistory } from 'src/models/history.model';
import { HistoryDocument } from 'src/schemas/history.schema';

@Injectable()
export class ViewService {
  constructor(
    @InjectModel(ILink.name) private linkModel: Model<LinkDocument>,
    @InjectModel(IHistory.name) private historyModel: Model<HistoryDocument>,
  ) {}

  async getLinkInformationById(shortId: string): Promise<ILink> | null {
    const link = await this.linkModel.findOne({ shortId });

    if (!link) {
      return null;
    }

    return {
      url: link.url,
      views: link.views,
      shortId: link.shortId,
      title: link.title,
    };
  }

  async getLinkHistory(shortId: string): Promise<IHistory[]> | null {
    const history = await this.historyModel.find({ shortId });

    if (!history) {
      return null;
    }

    return history;
  }
}
