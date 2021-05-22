import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../users/users.schema';

@Schema()
export class Message extends Document {
  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: User.name,
  })
  public author: User;

  @Prop({ required: true, default: new Date() })
  public sentAt: Date;

  @Prop({ required: true })
  public text: string;

  @Prop()
  public readAt: Date;
}

export type IMessage = Message & Document;

export const MessageSchema = SchemaFactory.createForClass(Message);
