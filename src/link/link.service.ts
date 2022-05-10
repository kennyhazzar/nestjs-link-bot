import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import axios, { AxiosResponse } from 'axios';
import { Connection, Model } from 'mongoose';
import { Observable } from 'rxjs';
import { ILink } from 'src/models/link.model';
import { LinkDocument } from 'src/link/schemas/link.schema';
import { DataDto } from './dto/data.dto';
import { parse } from 'node-html-parser';
import * as shortid from 'shortid'

@Injectable()
export class LinkService {
  constructor(
    private httpService: HttpService,
    @InjectConnection() private connection: Connection,
    @InjectModel(ILink.name) private linkModel: Model<LinkDocument>,
  ) { }

  async create(url: string) {
    const root = parse((await axios.get<string>(url)).data);
    const title = root.getElementsByTagName('title')[0].innerText;
    const subTitle = root.getElementsByTagName('meta')[0].getAttribute('content')
    const createdLink = new this.linkModel({ title, url, shortId: shortid.generate(), subTitle })
    return createdLink.save()
  }

  async findAll(): Promise<ILink[]> {
    return this.linkModel.find().exec()
  }

  async getLinkById(shortId: string): Promise<string> | null {
    const link = await this.linkModel.findOne({ shortId })

    if (!link) {
      return null
    }

    link.views++
    link.save()

    return link.url
  }

  async getLinkInformationById(shortId: string): Promise<ILink> | null {
    const link = await this.linkModel.findOne({ shortId })

    if (!link) {
      return null
    }

    link.views++
    link.save()

    return { url: link.url, views: link.views, shortId: link.shortId, title: link.title }
  }
}
