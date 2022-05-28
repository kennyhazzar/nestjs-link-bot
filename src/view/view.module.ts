import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ILink } from 'src/models/link.model';
import { ViewController } from './view.controller';
import { ViewService } from './view.service';
import { LinkSchema } from 'src/schemas/link.schema';
import { HttpModule } from '@nestjs/axios';

@Module({
  providers: [ViewService],
  controllers: [ViewController],
  imports: [
    HttpModule,
    MongooseModule.forFeature([{ name: ILink.name, schema: LinkSchema }]),
  ],
})
export class ViewModule {}
