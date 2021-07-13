import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ProtectWithRoles } from 'src/common/auth/protect-with-roles.decorator';
import * as roles from 'src/consts/roles';
import { Message } from '../support/message.schema';
import { SupportRequestClientService } from '../support/support-request-client.service';
import { SupportRequest } from '../support/support-request.schema';
import { SupportRequestService } from '../support/support-request.service';

@Controller('/api')
export class SupportController {
  constructor(
    private supportRequestService: SupportRequestService,
    private supportRequestClientService: SupportRequestClientService,
  ) {}

  @Post('/client/support-requests')
  @ProtectWithRoles(roles.CLIENT)
  async createSupportRequestByClient(@Body() body): Promise<SupportRequest> {
    const supportRequest =
      await this.supportRequestClientService.createSupportRequest(body);
    return supportRequest;
  }

  @Get('/client/support-requests')
  @ProtectWithRoles(roles.CLIENT)
  async getSupportRequestsByClient(@Param() params): Promise<SupportRequest[]> {
    const supportRequests =
      await this.supportRequestService.findSupportRequests(params);
    return supportRequests;
  }

  @Get('/manager/support-requests')
  @ProtectWithRoles(roles.MANAGER)
  async getSupportRequestsByManager(
    @Param() params,
  ): Promise<SupportRequest[]> {
    const supportRequests =
      await this.supportRequestService.findSupportRequests(params);
    return supportRequests;
  }

  @Get('/common/support-requests/:id/messages')
  @ProtectWithRoles(roles.MANAGER, roles.CLIENT)
  async getMessages(@Param() params): Promise<Message[]> {
    const messages = this.supportRequestService.getMessages(params.id);
    return messages;
  }

  @Post('/common/support-requests/:id/messages')
  @ProtectWithRoles(roles.MANAGER, roles.CLIENT)
  async sendMessage(@Param() params, @Body() body): Promise<Message> {
    const message = this.supportRequestService.sendMessage({
      ...body,
      supportRequest: params.id,
    });
    return message;
  }

  @Post('/common/support-requests/:id/messages/read')
  @ProtectWithRoles(roles.MANAGER, roles.CLIENT)
  async readMessages(@Param() params, @Body() body): Promise<void> {
    await this.supportRequestClientService.markMessagesAsRead({
      ...body,
      supportRequest: params.id,
    });
  }
}
