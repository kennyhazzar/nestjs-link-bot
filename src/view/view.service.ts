import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LinkDocument } from 'src/schemas/link.schema';
import { ILink } from 'src/models/link.model';

@Injectable()
export class ViewService {
  constructor(
    @InjectModel(ILink.name) private linkModel: Model<LinkDocument>,
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
}
