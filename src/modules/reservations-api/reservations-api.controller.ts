import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ProtectWithRoles } from 'src/modules/protect-with-roles.decorator';
import * as roles from 'src/consts/roles';
import { Reservation } from '../reservations/reservations.schema';
import { ReservationService } from '../reservations/reservations.service';

@Controller('/api')
export class ReservationsController {
  constructor(private reservationService: ReservationService) {}

  @Post('/client/reservations')
  @ProtectWithRoles(roles.CLIENT)
  async createReservation(@Body() body): Promise<Reservation> {
    const reservation = await this.reservationService.addReservation(body);
    return reservation;
  }

  @Get('/client/reservations')
  @ProtectWithRoles(roles.CLIENT)
  async getReservations(@Param() params): Promise<Reservation[]> {
    const reservations = await this.reservationService.getReservations(params);
    return reservations;
  }

  @Delete('/client/reservations/:id')
  @ProtectWithRoles(roles.CLIENT)
  async removeReservation(@Param() params): Promise<void> {
    await this.reservationService.removeReservation(params.id);
  }

  @Get('/manager/reservations/:userId')
  @ProtectWithRoles(roles.MANAGER)
  async getUserReservations(@Param() params): Promise<Reservation[]> {
    const reservations = await this.reservationService.getReservations({
      ...params,
      user: params.userId,
    });
    return reservations;
  }

  @Delete('/manager/reservations/:userId/:reservationId')
  @ProtectWithRoles(roles.MANAGER)
  async removeUserReservations(@Param() params): Promise<void> {
    await this.reservationService.removeReservation(params.reservationId);
  }
}
