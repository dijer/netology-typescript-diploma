import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ID } from '../../app.glossary';
import { IMessage, Message } from './message.schema';
import { ISupportRequest, SupportRequest } from './support-request.schema';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MessageGateway } from './message.gateway';

interface SendMessageDto {
  author: ID;
  supportRequest: ID;
  text: string;
}

interface GetChatListParams {
  user: ID | null;
  isActive: boolean;
}

interface ISupportRequestService {
  findSupportRequests(params: GetChatListParams): Promise<SupportRequest[]>;
  sendMessage(data: SendMessageDto): Promise<Message>;
  getMessages(supportRequest: ID): Promise<Message[]>;
  subscribe(handler: (supportRequest: ID, message: Message) => void): void;
  findSupportRequest(supportRequest: ID): Promise<SupportRequest>;
}

@Injectable()
export class SupportRequestService implements ISupportRequestService {
  constructor(
    @InjectModel(Message.name)
    private MessageModel: Model<IMessage>,
    @InjectModel(SupportRequest.name)
    private SupportRequestModel: Model<ISupportRequest>,
    private eventEmitter: EventEmitter2,
    private messageGateway: MessageGateway,
  ) {
    this.subscribe(async (supportRequest: ID, message: Message) => {
      this.messageGateway.server.emit('sendMessage', {
        chatId: supportRequest,
        message,
      });
    });
  }

  public async findSupportRequests(params: GetChatListParams) {
    const { user, isActive } = params;
    const searchParams: any = { isActive };
    if (!user) {
      searchParams.user = user;
    }
    const supportRequests = await this.SupportRequestModel.find(searchParams);
    return supportRequests;
  }

  public async findSupportRequest(supportRequestId: ID) {
    const supportRequest = await this.SupportRequestModel.findById(
      supportRequestId,
    );
    return supportRequest;
  }

  public async sendMessage(data: SendMessageDto) {
    const { author, supportRequest, text } = data;
    const supportRequestModel = await this.SupportRequestModel.findById(
      supportRequest,
    );
    const message = new this.MessageModel({
      author,
      text,
    });
    await message.save();
    supportRequestModel.messages.push(message);
    await supportRequestModel.save();
    this.eventEmitter.emit('sendMessage', supportRequest, message);
    return message;
  }

  public async getMessages(supportRequest: ID) {
    const supportRequestModel = await this.SupportRequestModel.findById(
      supportRequest,
    );
    return supportRequestModel.messages;
  }

  subscribe(handler: (supportRequest: ID, message: Message) => void) {
    this.eventEmitter.on('sendMessage', handler);
  }
}
