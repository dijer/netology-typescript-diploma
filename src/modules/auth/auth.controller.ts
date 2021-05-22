import { Body, Controller, Post, UsePipes, Res, Get } from '@nestjs/common';
import { PasswordHashPipe } from 'src/common/pipes/passwordHash.pipe';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import * as roles from 'src/conts/roles';
import { Roles } from 'src/common/decorators/role.decorator';

@Controller('/api')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @Post('/auth/login')
  @Roles(roles.ANONYMOUS)
  async login(@Body() body, @Res() res) {
    const { token, email, name, contactPhone } = await this.authService.login(
      body,
    );
    return res.cookie('jwt', token, { httpOnly: true }).json({
      email,
      name,
      contactPhone,
    });
  }

  @Post('/auth/logout')
  @Roles(roles.REGISTERED)
  async logout(@Res() res) {
    res.clearCookie('jwt');
    return res.sendStatus(200);
  }

  @Post('/client/register')
  @Roles(roles.ANONYMOUS)
  @UsePipes(PasswordHashPipe)
  async register(@Body() body) {
    const user = await this.userService.create({
      ...body,
      role: roles.CLIENT,
    });
    const { _id, email, name } = user;
    return {
      id: _id,
      email,
      name,
    };
  }
}
