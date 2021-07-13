import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import * as roles from 'src/consts/roles';
import { User } from '../users/users.schema';
import { UsersService } from '../users/users.service';
import { ProtectWithRoles } from 'src/modules/protect-with-roles.decorator';

@Controller('/api')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/admin/users/')
  @ProtectWithRoles(roles.ADMIN)
  async createUser(@Body() body): Promise<Partial<User>> {
    const user = await this.usersService.create(body);
    return user;
  }

  @Get('/admin/users/')
  @ProtectWithRoles(roles.ADMIN)
  async getUsersByAdmin(@Param() params): Promise<Array<Partial<User>>> {
    const users = this.usersService.findAll(params);
    return users;
  }

  @Get('/manager/users/')
  @ProtectWithRoles(roles.MANAGER)
  async getUsersByManager(@Param() params): Promise<Array<Partial<User>>> {
    const users = this.usersService.findAll(params);
    return users;
  }
}
