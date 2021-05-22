import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import { SupportRequestService } from './support-request.service';
import * as roles from 'src/conts/roles';

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer() server;
  constructor(private readonly supportRequestService: SupportRequestService) {}

  @SubscribeMessage('subscribeToChat')
  async handleMessage(
    @MessageBody() chatId: string,
    @ConnectedSocket() client: Socket,
  ) {
    const authorization = client.handshake.headers.authorization;
    if (!authorization) {
      return;
    }
    const token = authorization.replace(/Bearer /, '');
    const payload: any = jwt.verify(token, process.env.JWT_SECRET);
    const { role, id } = payload;
    if (!(role === roles.MANAGER || role === roles.CLIENT)) {
      return;
    }

    const supportRequest = await this.supportRequestService.findSupportRequest(
      chatId,
    );

    if (role === roles.CLIENT && supportRequest.user !== id) {
      return;
    }

    client.join(chatId);
  }
}
