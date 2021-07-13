import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './modules/users/users.module';
import { HotelsModule } from './modules/hotels/hotels.module';
import { ReservationsModule } from './modules/reservations/reservations.module';
import { SupportModule } from './modules/support/support.module';
import { AuthModule } from './modules/auth/auth.module';
import { HotelsApiModule } from './modules/hotels-api/hotels-api.module';
import { ReservationsApiModule } from './modules/reservations-api/reservations-api.module';
import { UsersApiModule } from './modules/users-api/users-api.module';
import { AuthApiModule } from './modules/auth-api/auth-api.module';
import { SupportApiModule } from './modules/support-api/support-api.module';

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
    HotelsApiModule,
    ReservationsApiModule,
    UsersApiModule,
    AuthApiModule,
    SupportApiModule,
  ],
})
export class AppModule {}
