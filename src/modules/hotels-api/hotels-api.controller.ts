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
import { ProtectWithRoles } from 'src/common/auth/protect-with-roles.decorator';
import * as roles from 'src/consts/roles';
import { Hotel } from '../hotels/hotels.schema';
import { HotelService } from '../hotels/hotels.service';
import { HotelRoom } from '../hotels/room.schema';
import { HotelRoomService } from '../hotels/room.service';
import { SearchInterceptor } from './search.interceptor';

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
  @ProtectWithRoles(roles.ADMIN)
  async createHotel(@Body() body): Promise<Hotel> {
    const hotel = await this.hotelService.create(body);
    return hotel;
  }

  @Get('/admin/hotels/')
  @ProtectWithRoles(roles.ADMIN)
  async getHotels(@Param() params): Promise<Hotel[]> {
    const hotels = await this.hotelService.search(params);
    return hotels;
  }

  @Put('/admin/hotels/:id')
  @ProtectWithRoles(roles.ADMIN)
  async updateHotel(@Param() params, @Body() body): Promise<Hotel> {
    const hotel = await this.hotelService.update(params.id, body);
    return hotel;
  }

  @Post('/admin/hotel-rooms/')
  @ProtectWithRoles(roles.ADMIN)
  async createHotelRoom(@Body() body): Promise<HotelRoom> {
    const hotelRoom = await this.hotelRoomService.create(body);
    return hotelRoom;
  }

  @Put('/admin/hotel-rooms/:id')
  @ProtectWithRoles(roles.ADMIN)
  async updateHotelRoom(@Param() params, @Body() body): Promise<HotelRoom> {
    const hotelRoom = await this.hotelRoomService.update(params.id, body);
    return hotelRoom;
  }
}
