import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IHistory } from 'src/models/history.model';
import { ILink } from 'src/models/link.model';
import { HistorySchema } from 'src/schemas/history.schema';
import { LinkSchema } from 'src/schemas/link.schema';
import { LinkController } from './link.controller';
import { LinkService } from './link.service';

@Module({
  controllers: [LinkController],
  providers: [LinkService],
  imports: [
    MongooseModule.forFeature([{ name: ILink.name, schema: LinkSchema }]),
    MongooseModule.forFeature([{ name: IHistory.name, schema: HistorySchema }]),
  ],
})
export class LinkModule {}
