import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReservationsController } from './reservations.controller';
import { Reservation, ReservationSchema } from './reservations.schema';
import { ReservationService } from './reservations.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Reservation.name,
        schema: ReservationSchema,
      },
    ]),
  ],
  providers: [ReservationService],
  controllers: [ReservationsController],
  exports: [ReservationService],
})
export class ReservationsModule {}
