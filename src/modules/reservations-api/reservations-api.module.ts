import { Module } from '@nestjs/common';
import { ReservationsController } from '../reservations-api/reservations-api.controller';
import { ReservationsModule } from '../reservations/reservations.module';

@Module({
  imports: [ReservationsModule],
  controllers: [ReservationsController],
})
export class ReservationsApiModule {}
