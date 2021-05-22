import { Injectable } from '@nestjs/common';
import { IUser, User } from './users.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ID } from '../../app.glossary';

type TUserServiceSearchParam = { $regex: string; $options: 'i' };

interface SearchUserParams {
  limit: number;
  offset: number;
  email: string;
  name: string;
  contactPhone: string;
}

interface IUserService {
  create(data: Partial<User>): Promise<User>;
  findById(id: ID): Promise<User>;
  findByEmail(email: string): Promise<User>;
  findAll(params: SearchUserParams): Promise<User[]>;
}

@Injectable()
export class UsersService implements IUserService {
  constructor(
    @InjectModel(User.name)
    private UserModel: Model<IUser>,
  ) {}

  public async create(data: Partial<User>) {
    const user = new this.UserModel(data);
    await user.save();
    return user;
  }

  public async findById(id: ID) {
    const user = await this.UserModel.findById(id);
    return user;
  }

  public async findByEmail(email: string) {
    const user = await this.UserModel.findOne({
      email,
    });
    return user;
  }

  public async findAll(params: SearchUserParams) {
    const { email, name, contactPhone, ...rest } = params;
    const searchParams: {
      limit: number;
      offset: number;
    } & {
      email?: TUserServiceSearchParam;
      name?: TUserServiceSearchParam;
      contactPhone?: TUserServiceSearchParam;
    } = { ...rest };
    if (email) {
      searchParams.email = {
        $regex: email,
        $options: 'i',
      };
    }
    if (name) {
      searchParams.name = {
        $regex: name,
        $options: 'i',
      };
    }
    if (contactPhone) {
      searchParams.contactPhone = {
        $regex: contactPhone,
        $options: 'i',
      };
    }
    const users = await this.UserModel.find(searchParams);
    return users;
  }
}
