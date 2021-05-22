import { Injectable } from '@nestjs/common';
import { Reservation, IReservation } from './reservations.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ID } from '../../app.glossary';
import { ReservationDto } from './reservation.dto';

interface ReservationSearchOptions {
  user: ID;
  dateStart: Date;
  dateEnd: Date;
}
interface IReservationService {
  addReservation(data: ReservationDto): Promise<Reservation>;
  removeReservation(id: ID): Promise<void>;
  getReservations(
    filter: ReservationSearchOptions,
  ): Promise<Array<Reservation>>;
}

@Injectable()
export class ReservationService implements IReservationService {
  constructor(
    @InjectModel(Reservation.name)
    private ReservationModel: Model<IReservation>,
  ) {}

  public async addReservation(data: ReservationDto) {
    const reservation = new this.ReservationModel(data).populate({
      path: 'roomId',
    });
    await reservation.save();
    return reservation;
  }

  public async removeReservation(id: ID) {
    await this.ReservationModel.findByIdAndDelete(id);
  }

  public async getReservations(filter: ReservationSearchOptions) {
    const reservations = await this.ReservationModel.find(filter);
    return reservations;
  }
}
