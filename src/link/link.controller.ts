import {
  Controller,
  Get,
  Ip,
  Param,
  Post,
  Query,
  Redirect,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ILink } from 'src/models/link.model';
import { LinkService } from './link.service';

@Controller('link')
export class LinkController {
  constructor(private linkService: LinkService) { }

  @Get()
  scrapperController(@Ip() ip): string {
    return `main shit. your ip is ${ip}`
  }

  @Post('/create')
  createLink(@Query('link') link) {
    return this.linkService.create(link);
  }

  @Get('/all')
  getAll() {
    return this.linkService.findAll()
  }

  @Get(':id')
  @Redirect()
  async openShortLink(@Param('id') id: string, @Res() response: Response) {

    try {
      const link = await this.linkService.getLinkById(id)

      if (!link) {
        return { url: '/' }
      }

      return { url: link }
    } catch (error) {
      response.status(500).send({ error: "something wrong in server" })
    }
  }

  @Get(':id/view')
  async getLinkInformation(@Param('id') id: string, @Res() response: Response) {
    try {

      const link = await this.linkService.getLinkInformationById(id)

      if (!link) {
        response.status(404).send({ error: "this link does not exist" })
      }

      return link
    } catch (error) {
      response.status(500).send({ error: "something wrong in server" })
    }
  }
}
