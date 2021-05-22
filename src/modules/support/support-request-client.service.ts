import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ID } from '../../app.glossary';
import { ISupportRequest, SupportRequest } from './support-request.schema';
import { IMessage, Message } from './message.schema';

interface CreateSupportRequestDto {
  user: ID;
  text: string;
}

interface MarkMessagesAsReadDto {
  user: ID;
  supportRequest: ID;
  createdBefore: Date;
}

interface ISupportRequestClientService {
  createSupportRequest(data: CreateSupportRequestDto): Promise<SupportRequest>;
  markMessagesAsRead(params: MarkMessagesAsReadDto): Promise<void>;
  getUnreadCount(supportRequest: ID): Promise<Message[]>;
}

@Injectable()
export class SupportRequestClientService
  implements ISupportRequestClientService
{
  constructor(
    @InjectModel(Message.name)
    private MessageModel: Model<IMessage>,
    @InjectModel(SupportRequest.name)
    private SupportRequestModel: Model<ISupportRequest>,
  ) {}

  public async createSupportRequest(data: CreateSupportRequestDto) {
    const { user, text } = data;
    const message = new this.MessageModel({
      author: user,
      text,
    });
    await message.save();
    const supportRequest = new this.SupportRequestModel({
      user,
      messages: [message],
    });
    await supportRequest.save();
    return supportRequest;
  }

  public async markMessagesAsRead(params: MarkMessagesAsReadDto) {
    const { user, supportRequest, createdBefore } = params;
    await this.SupportRequestModel.findOne({
      _id: supportRequest,
      author: user,
    })
      .populate({
        path: 'messages',
        match: {
          sentAt: {
            '&lt': createdBefore,
          },
          readAt: null,
        },
        populate: {
          path: 'author',
          match: {
            role: {
              $ne: 'client',
            },
          },
        },
      })
      .exec((err, sr) => {
        const currentDate = new Date();
        sr.messages.forEach(async (msg) => {
          msg.readAt = currentDate;
          await msg.save();
        });
      });
  }

  public async getUnreadCount(supportRequest: ID) {
    const supportRequestModel = await this.SupportRequestModel.findById(
      supportRequest,
    ).populate({
      path: 'messages',
      match: {
        readAt: null,
      },
      populate: {
        path: 'author',
        match: {
          role: 'manager',
        },
      },
    });
    return supportRequestModel.messages;
  }
}
