import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LinkController } from 'src/link/link.controller';
import { LinkService } from 'src/link/link.service';
import { ILink } from 'src/models/link.model';
import { LinkSchema } from 'src/schemas/link.schema';
import { ViewController } from 'src/view/view.controller';
import { ViewService } from 'src/view/view.service';
import { TelegramController } from './telegram.controller';
import { TelegramService } from './telegram.service';
import { TelegramUpdate } from './telegram.update';
import { CreateLinkWizard } from './wizards/create-link.wizard';
import { SubscribeToUpdate } from './wizards/subscribe-to-update.wizard';
import { ViewByFullUrlWizard } from './wizards/view-by-full-url.wizard';

@Module({
  controllers: [TelegramController, LinkController, ViewController],
  providers: [
    TelegramService,
    TelegramUpdate,
    LinkService,
    ViewService,
    CreateLinkWizard,
    ViewByFullUrlWizard,
    SubscribeToUpdate,
  ],
  imports: [
    MongooseModule.forFeature([{ name: ILink.name, schema: LinkSchema }]),
  ],
})
export class TelegramModule { }
