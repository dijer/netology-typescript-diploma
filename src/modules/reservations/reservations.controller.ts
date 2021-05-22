import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { Roles } from 'src/common/decorators/role.decorator';
import * as roles from 'src/conts/roles';
import { Reservation } from './reservations.schema';
import { ReservationService } from './reservations.service';

@Controller('/api')
export class ReservationsController {
  constructor(private reservationService: ReservationService) {}

  @Post('/client/reservations')
  @Roles(roles.CLIENT)
  async createReservation(@Body() body): Promise<Reservation> {
    const reservation = await this.reservationService.addReservation(body);
    return reservation;
  }

  @Get('/client/reservations')
  @Roles(roles.CLIENT)
  async getReservations(@Param() params): Promise<Reservation[]> {
    const reservations = await this.reservationService.getReservations(params);
    return reservations;
  }

  @Delete('/client/reservations/:id')
  @Roles(roles.CLIENT)
  async removeReservation(@Param() params): Promise<void> {
    await this.reservationService.removeReservation(params.id);
  }

  @Get('/manager/reservations/:userId')
  @Roles(roles.MANAGER)
  async getUserReservations(@Param() params): Promise<Reservation[]> {
    const reservations = await this.reservationService.getReservations({
      ...params,
      user: params.userId,
    });
    return reservations;
  }

  @Delete('/manager/reservations/:userId/:reservationId')
  @Roles(roles.MANAGER)
  async removeUserReservations(@Param() params): Promise<void> {
    await this.reservationService.removeReservation(params.reservationId);
  }
}
