import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './modules/users/users.module';
import { HotelsModule } from './modules/hotels/hotels.module';
import { ReservationsModule } from './modules/reservations/reservations.module';
import { SupportModule } from './modules/support/support.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URL),
    UsersModule,
    HotelsModule,
    ReservationsModule,
    SupportModule,
    AuthModule,
  ],
})
export class AppModule {}
