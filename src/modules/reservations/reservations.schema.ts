import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Hotel } from '../hotels/hotels.schema';
import { HotelRoom } from '../hotels/room.schema';
import { User } from '../users/users.schema';

@Schema()
export class Reservation extends Document {
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: User.name,
  })
  public userId: Types.ObjectId;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: Hotel.name,
  })
  public hotelId: Types.ObjectId;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: HotelRoom.name,
  })
  public roomId: Types.ObjectId;

  @Prop({ required: true })
  public dateStart: Date;

  @Prop({ required: true })
  public dateEnd: Date;
}

export type IReservation = Reservation & Document;

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
