import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Hotel } from './hotels.schema';

@Schema({ timestamps: true })
export class HotelRoom extends Document {
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: Hotel.name,
  })
  public hotel: Types.ObjectId;

  @Prop()
  public description: string;

  @Prop({ default: [] })
  public images: string[];

  @Prop({ required: true, default: true })
  public isEnabled: boolean;
}

export type IHotelRoom = HotelRoom & Document;

export const HotelRoomSchema = SchemaFactory.createForClass(HotelRoom);
