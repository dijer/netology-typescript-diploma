import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Roles } from 'src/common/decorators/role.decorator';
import * as roles from 'src/conts/roles';
import { Message } from './message.schema';
import { SupportRequestClientService } from './support-request-client.service';
import { SupportRequest } from './support-request.schema';
import { SupportRequestService } from './support-request.service';

@Controller('/api')
export class SupportController {
  constructor(
    private supportRequestService: SupportRequestService,
    private supportRequestClientService: SupportRequestClientService,
  ) {}

  @Post('/client/support-requests')
  @Roles(roles.CLIENT)
  async createSupportRequestByClient(@Body() body): Promise<SupportRequest> {
    const supportRequest =
      await this.supportRequestClientService.createSupportRequest(body);
    return supportRequest;
  }

  @Get('/client/support-requests')
  @Roles(roles.CLIENT)
  async getSupportRequestsByClient(@Param() params): Promise<SupportRequest[]> {
    const supportRequests =
      await this.supportRequestService.findSupportRequests(params);
    return supportRequests;
  }

  @Get('/manager/support-requests')
  @Roles(roles.MANAGER)
  async getSupportRequestsByManager(
    @Param() params,
  ): Promise<SupportRequest[]> {
    const supportRequests =
      await this.supportRequestService.findSupportRequests(params);
    return supportRequests;
  }

  @Get('/common/support-requests/:id/messages')
  @Roles(roles.MANAGER, roles.CLIENT)
  async getMessages(@Param() params): Promise<Message[]> {
    const messages = this.supportRequestService.getMessages(params.id);
    return messages;
  }

  @Post('/common/support-requests/:id/messages')
  @Roles(roles.MANAGER, roles.CLIENT)
  async sendMessage(@Param() params, @Body() body): Promise<Message> {
    const message = this.supportRequestService.sendMessage({
      ...body,
      supportRequest: params.id,
    });
    return message;
  }

  @Post('/common/support-requests/:id/messages/read')
  @Roles(roles.MANAGER, roles.CLIENT)
  async readMessages(@Param() params, @Body() body): Promise<void> {
    await this.supportRequestClientService.markMessagesAsRead({
      ...body,
      supportRequest: params.id,
    });
  }
}
