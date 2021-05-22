import { Injectable } from '@nestjs/common';
import { HotelRoom, IHotelRoom } from './room.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ID } from '../../app.glossary';
import { Hotel, IHotel } from './hotels.schema';

interface SearchRoomsParams {
  limit: number;
  offset: number;
  title: string;
  isEnabled?: boolean;
}

interface IHotelRoomService {
  create(data: Partial<HotelRoom>): Promise<HotelRoom>;
  findById(id: ID, isEnabled?: true): Promise<HotelRoom>;
  search(params: SearchRoomsParams): Promise<HotelRoom[]>;
  update(id: ID, data: Partial<HotelRoom>): Promise<HotelRoom>;
}

@Injectable()
export class HotelRoomService implements IHotelRoomService {
  constructor(
    @InjectModel(HotelRoom.name)
    private HotelRoomModel: Model<IHotelRoom>,
    @InjectModel(Hotel.name)
    private HotelModel: Model<IHotel>,
  ) {}

  public async create(data: Partial<HotelRoom>) {
    const hotelRoom = new this.HotelRoomModel(data);
    await hotelRoom.save();
    return hotelRoom;
  }

  public async findById(id: ID, isEnabled?: true) {
    const searchParams: {
      _id: ID;
      isEnabled?: boolean;
    } = {
      _id: id,
    };
    if (typeof isEnabled === 'boolean') {
      searchParams.isEnabled = isEnabled;
    }
    const hotelRoom = await this.HotelRoomModel.findOne(searchParams);
    return hotelRoom;
  }

  public async search(params: SearchRoomsParams) {
    const { isEnabled, title, offset, limit } = params;
    const searchParams: any = {};
    if (typeof isEnabled === 'boolean') {
      searchParams.isEnabled = isEnabled;
    }
    const hotel = await this.HotelModel.findOne({
      title,
    });

    searchParams.hotel = hotel._id;

    const hotelRooms = await this.HotelRoomModel.find(searchParams)
      .skip(offset)
      .limit(limit)
      .populate({
        path: 'hotel',
      });
    return hotelRooms;
  }

  public async update(id: ID, data: Partial<HotelRoom>) {
    const hotelRoom = await this.HotelRoomModel.findByIdAndUpdate(id, data);
    return hotelRoom;
  }
}
