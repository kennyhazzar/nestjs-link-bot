import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserLocationDto } from 'src/link/dto/location.dto';
import { IHistory } from 'src/models/history.model';

export type HistoryDocument = IHistory & Document;

@Schema()
export class History {
  @Prop({ required: true })
  location: UserLocationDto;

  @Prop({ required: true })
  visitedAt: number;

  @Prop({ required: true })
  shortId: string;

  @Prop({ required: false })
  userId?: number;
}

export const HistorySchema = SchemaFactory.createForClass(History);
