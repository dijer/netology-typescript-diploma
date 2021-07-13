import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { UsersController } from './users-api.controller';

@Module({
  imports: [UsersModule],
  controllers: [UsersController],
})
export class UsersApiModule {}
