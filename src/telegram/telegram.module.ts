import { HttpService } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LinkController } from 'src/link/link.controller';
import { LinkModule } from 'src/link/link.module';
import { LinkService } from 'src/link/link.service';
import { ILink } from 'src/models/link.model';
import { LinkSchema } from 'src/schemas/link.schema';
import { ViewController } from 'src/view/view.controller';
import { ViewModule } from 'src/view/view.module';
import { ViewService } from 'src/view/view.service';
import { TelegramController } from './telegram.controller';
import { TelegramService } from './telegram.service';
import { TelegramUpdate } from './telegram.update';
import { CreateLinkWizard, ViewByFullUrlWizard } from './telegram.wizard';

@Module({
  controllers: [TelegramController, LinkController, ViewController],
  providers: [
    TelegramService,
    TelegramUpdate,
    LinkService,
    ViewService,
    CreateLinkWizard,
    ViewByFullUrlWizard
  ],
  imports: [
    MongooseModule.forFeature([{ name: ILink.name, schema: LinkSchema }]),
  ],
})
export class TelegramModule { }
