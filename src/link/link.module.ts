import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ILink } from 'src/models/link.model';
import { LinkSchema } from 'src/link/schemas/link.schema';
import { LinkController } from './link.controller';
import { LinkService } from './link.service';

@Module({
  controllers: [LinkController],
  providers: [LinkService],
  imports: [
    HttpModule,
    MongooseModule.forFeature([{ name: ILink.name, schema: LinkSchema }]),
  ],
})
export class ScrapperModule { }
