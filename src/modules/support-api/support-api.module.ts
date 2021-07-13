import { Module } from '@nestjs/common';
import { SupportModule } from '../support/support.module';
import { SupportController } from './support-api.controller';

@Module({
  imports: [SupportModule],
  controllers: [SupportController],
})
export class SupportApiModule {}
