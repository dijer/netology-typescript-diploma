import { Module } from '@nestjs/common';
import { HotelsModule } from '../hotels/hotels.module';
import { HotelsController } from './hotels-api.controller';

@Module({
  imports: [HotelsModule],
  controllers: [HotelsController],
})
export class HotelsApiModule {}
