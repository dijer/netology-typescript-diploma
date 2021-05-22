import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, SchemaTypes } from 'mongoose';
import { User } from '../users/users.schema';
import { Message } from './message.schema';

@Schema()
export class SupportRequest extends Document {
  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: User.name,
  })
  public user: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, default: new Date() })
  public createdAt: Date;

  @Prop([
    {
      type: SchemaTypes.ObjectId,
      ref: Message.name,
    },
  ])
  public messages: Message[];

  @Prop()
  public isActive: boolean;
}

export type ISupportRequest = SupportRequest & Document;

export const SupportRequestSchema =
  SchemaFactory.createForClass(SupportRequest);
