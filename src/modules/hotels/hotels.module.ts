import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Hotel, HotelSchema } from './hotels.schema';
import { HotelService } from './hotels.service';
import { HotelRoom, HotelRoomSchema } from './room.schema';
import { HotelRoomService } from './room.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Hotel.name,
        schema: HotelSchema,
      },
      {
        name: HotelRoom.name,
        schema: HotelRoomSchema,
      },
    ]),
  ],
  providers: [HotelService, HotelRoomService],
  exports: [HotelService, HotelRoomService],
})
export class HotelsModule {}
