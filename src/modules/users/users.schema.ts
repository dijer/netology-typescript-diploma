import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  public email: string;

  @Prop({ required: true })
  public passwordHash: string;

  @Prop({ required: true })
  public name: string;

  @Prop()
  public contactPhone: string;

  @Prop({ required: true, default: 'client' })
  public role: string;
}

export type IUser = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
