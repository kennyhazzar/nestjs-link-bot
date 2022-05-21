﻿import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ILink } from 'src/models/link.model';

export type LinkDocument = ILink & Document;

@Schema()
export class Link {
  @Prop({ required: true })
  title: string;

  @Prop({ required: false })
  subTitle: string;

  @Prop({ required: false })
  description: string;

  @Prop({ required: false })
  picture?: string;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  shortId: string;

  @Prop({ default: 0 })
  views: number;

  @Prop({ default: true })
  isVisible: boolean;
}

export const LinkSchema = SchemaFactory.createForClass(Link);