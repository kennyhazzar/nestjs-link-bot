import { Controller, Get, Redirect } from '@nestjs/common';

@Controller('')
export class AppController {
  @Get()
  @Redirect()
  redirectToBot() {
    return { url: process.env.URL_BOT };
  }
}
