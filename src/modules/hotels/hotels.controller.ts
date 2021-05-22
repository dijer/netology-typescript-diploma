import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { ID } from 'src/app.glossary';
import { Roles } from 'src/common/decorators/role.decorator';
import * as roles from 'src/conts/roles';
import { Hotel } from './hotels.schema';
import { HotelService } from './hotels.service';
import { HotelRoom } from './room.schema';
import { HotelRoomService } from './room.service';
import { SearchInterceptor } from '../../common/interceptors/search.interceptor';

@Controller('/api')
export class HotelsController {
  constructor(
    private hotelRoomService: HotelRoomService,
    private hotelService: HotelService,
  ) {}

  @Get('/common/hotel-rooms')
  @UseInterceptors(SearchInterceptor)
  async getHotelRooms(
    @Param() params: { limit: number; offset: number; hotel: ID },
  ): Promise<HotelRoom[]> {
    const { limit, offset, hotel } = params;
    const hotelModel = await this.hotelService.findById(hotel);
    return await this.hotelRoomService.search({
      title: hotelModel.title,
      limit,
      offset,
    });
  }

  @Get('/common/hotel-rooms/:id')
  @UseInterceptors(SearchInterceptor)
  async getHotelRoom(@Param() params): Promise<HotelRoom> {
    const hotelRoom = await this.hotelRoomService.findById(params.id);
    return hotelRoom;
  }

  @Post('/admin/hotels/')
  @Roles(roles.ADMIN)
  async createHotel(@Body() body): Promise<Hotel> {
    const hotel = await this.hotelService.create(body);
    return hotel;
  }

  @Get('/admin/hotels/')
  @Roles(roles.ADMIN)
  async getHotels(@Param() params): Promise<Hotel[]> {
    const hotels = await this.hotelService.search(params);
    return hotels;
  }

  @Put('/admin/hotels/:id')
  @Roles(roles.ADMIN)
  async updateHotel(@Param() params, @Body() body): Promise<Hotel> {
    const hotel = await this.hotelService.update(params.id, body);
    return hotel;
  }

  @Post('/admin/hotel-rooms/')
  @Roles(roles.ADMIN)
  async createHotelRoom(@Body() body): Promise<HotelRoom> {
    const hotelRoom = await this.hotelRoomService.create(body);
    return hotelRoom;
  }

  @Put('/admin/hotel-rooms/:id')
  @Roles(roles.ADMIN)
  async updateHotelRoom(@Param() params, @Body() body): Promise<HotelRoom> {
    const hotelRoom = await this.hotelRoomService.update(params.id, body);
    return hotelRoom;
  }
}
