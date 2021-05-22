import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ID } from '../../app.glossary';
import { IMessage, Message } from './message.schema';
import { ISupportRequest, SupportRequest } from './support-request.schema';

interface MarkMessagesAsReadDto {
  user: ID;
  supportRequest: ID;
  createdBefore: Date;
}

interface ISupportRequestEmployeeService {
  markMessagesAsRead(params: MarkMessagesAsReadDto): Promise<void>;
  getUnreadCount(supportRequest: ID): Promise<Message[]>;
  closeRequest(supportRequest: ID): Promise<void>;
}

@Injectable()
export class SupportRequestEmployeeService
  implements ISupportRequestEmployeeService
{
  constructor(
    @InjectModel(Message.name)
    private MessageModel: Model<IMessage>,
    @InjectModel(SupportRequest.name)
    private SupportRequestModel: Model<ISupportRequest>,
  ) {}

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
              $eq: 'client',
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
          role: 'client',
        },
      },
    });
    return supportRequestModel.messages;
  }

  public async closeRequest(supportRequest: ID) {
    await this.SupportRequestModel.findByIdAndUpdate(supportRequest, {
      isActive: false,
    });
  }
}
