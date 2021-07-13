import { Module } from '@nestjs/common';
import { AuthController } from '../auth-api/auth.controller';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [AuthModule, UsersModule],
  controllers: [AuthController],
})
export class AuthApiModule {}
