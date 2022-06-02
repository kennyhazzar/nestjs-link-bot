import {
  Controller,
  Get,
  Param,
  Post,
  Redirect,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { LinkService } from 'src/link/link.service';
import { ViewService } from './view.service';

@Controller('/api/:id')
export class ViewController {
  constructor(
    private readonly viewService: ViewService,
    private readonly linkService: LinkService,
  ) { }

  @Get('view')
  async getText(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response> {
    const link = await this.viewService.getLinkInformationById(id);
    if (!link) {
      return res.status(404).send({ error: 'this short link does not exist!' });
    }
    return res.status(200).send(link);
  }
  @Get()
  @Redirect()
  async redirectToLinkController(@Param('id') id: string) {
    return {
      url: `${process.env.HOST}/link/${id}`,
    };
  }

  @Post('subscribe')
  async subscribeUserToLink(@Param('id') id: string) {
    const result = await this.linkService.subscribeUserToLinkByLink(id);
    return result;
  }

  @Get('history')
  async getLinkHistoryById(@Param('id') id: string) {
    return await this.viewService.getLinkHistory(id);
  }
}
