import { Injectable } from '@nestjs/common';
import { Hotel, IHotel } from './hotels.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ID } from '../../app.glossary';

type TSearchHotels = {
  limit: number;
  offset: number;
};

interface IHotelService {
  create(data: any): Promise<Hotel>;
  findById(id: ID): Promise<Hotel>;
  search(params: TSearchHotels): Promise<Hotel[]>;
  update(id: ID, data: Partial<Hotel>): Promise<Hotel>;
}

@Injectable()
export class HotelService implements IHotelService {
  constructor(
    @InjectModel(Hotel.name)
    private HotelModel: Model<IHotel>,
  ) {}

  public async create(data: any) {
    const hotel = new this.HotelModel(data);
    await hotel.save();
    return hotel;
  }

  public async findById(id: ID) {
    const hotel = await this.HotelModel.findById(id);
    return hotel;
  }

  public async search(params: TSearchHotels) {
    const { limit, offset } = params;
    const hotels = await this.HotelModel.find().skip(offset).limit(limit);
    return hotels;
  }

  public async update(id: ID, data: Partial<Hotel>) {
    const hotel = this.HotelModel.findByIdAndUpdate(id, data);
    return hotel;
  }
}
