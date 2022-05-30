import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Redirect,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { LinkService } from './link.service';

@Controller('link')
export class LinkController {
  constructor(private linkService: LinkService) {}

  @Post('/create')
  createLink(@Query('link') link, @Res() response: Response) {
    try {
      return this.linkService.create(link);
    } catch (error) {
      return response
        .status(500)
        .send({ error: `can't create link: something wrong in code` });
    }
  }

  @Get('/all')
  getAll() {
    return this.linkService.findAll();
  }
  @Get('find')
  async findLink(@Query('title') title: string, @Res() response: Response) {
    try {
      const links = await this.linkService.findLinksByTitle(title);

      if (!links || links.length === 0) {
        return response
          .status(404)
          .send({ error: `this links does not exist` });
      }
    } catch (error) {
      response.status(500).send({ error: 'something wrong in server' });
    }
  }

  @Get(':id')
  @Redirect()
  async openShortLink(@Param('id') id: string, @Res() response: Response) {
    try {
      const link = await this.linkService.getLinkById(id);

      if (!link) {
        return { url: '/' };
      }

      return { url: link };
    } catch (error) {
      response.status(500).send({ error: 'something wrong in server' });
    }
  }
}
