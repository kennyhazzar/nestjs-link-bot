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
import { LinkService } from './link.service';

@Controller('link')
export class LinkController {
  constructor(private linkService: LinkService) {}

  @Get()
  linkController(@Ip() ip): string {
    return `main shit. your ip is ${ip}`;
  }

  @Post('/create')
  createLink(@Query('link') link) {
    return this.linkService.create(link);
  }

  @Get('/all')
  getAll() {
    return this.linkService.findAll();
  }

  @Get('find')
  findLink(@Query('title') title) {
    return this.linkService.findLinksByTitle(title);
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
