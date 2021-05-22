import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import * as roles from 'src/conts/roles';
import { User } from './users.schema';
import { UsersService } from './users.service';
import { Roles } from 'src/common/decorators/role.decorator';

@Controller('/api')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/admin/users/')
  @Roles(roles.ADMIN)
  async createUser(@Body() body): Promise<Partial<User>> {
    const user = await this.usersService.create(body);
    return user;
  }

  @Get('/admin/users/')
  @Roles(roles.ADMIN)
  async getUsersByAdmin(@Param() params): Promise<Array<Partial<User>>> {
    const users = this.usersService.findAll(params);
    return users;
  }

  @Get('/manager/users/')
  @Roles(roles.MANAGER)
  async getUsersByManager(@Param() params): Promise<Array<Partial<User>>> {
    const users = this.usersService.findAll(params);
    return users;
  }
}
