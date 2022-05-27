import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ILink } from 'src/models/link.model';

export type LinkDocument = ILink & Document;

@Schema()
export class Link {
  @Prop({ required: true, text: true })
  title: string;

  @Prop({ required: false, text: true })
  subTitle: string;

  @Prop({ required: false, text: true, index: true })
  description: string;

  @Prop({ required: false })
  picture?: string;

  @Prop({ required: true, text: true, index: true })
  url: string;

  @Prop({ required: true, text: true, index: true })
  shortId: string;

  @Prop({ default: 0 })
  views: number;

  @Prop({ default: true })
  isVisible: boolean;
  @Prop({ default: false })
  userId: string;
}

export const LinkSchema = SchemaFactory.createForClass(Link);
