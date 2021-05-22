import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Hotel extends Document {
  @Prop({ required: true })
  public title: string;

  @Prop()
  public description: string;
}

export type IHotel = Hotel & Document;

export const HotelSchema = SchemaFactory.createForClass(Hotel);
