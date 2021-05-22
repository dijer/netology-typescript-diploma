import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageGateway } from './message.gateway';
import { ChatGateway } from './chat.gateway';
import { MessageListener } from './message.listener';
import { Message, MessageSchema } from './message.schema';
import { SupportRequestClientService } from './support-request-client.service';
import { SupportRequestEmployeeService } from './support-request-employee.service';
import { SupportRequest, SupportRequestSchema } from './support-request.schema';
import { SupportRequestService } from './support-request.service';
import { SupportController } from './support.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: SupportRequest.name,
        schema: SupportRequestSchema,
      },
      {
        name: Message.name,
        schema: MessageSchema,
      },
    ]),
    EventEmitterModule.forRoot(),
  ],
  providers: [
    SupportRequestService,
    SupportRequestClientService,
    SupportRequestEmployeeService,
    MessageListener,
    MessageGateway,
    ChatGateway,
  ],
  controllers: [SupportController],
  exports: [
    SupportRequestService,
    SupportRequestClientService,
    SupportRequestEmployeeService,
  ],
})
export class SupportModule {}
