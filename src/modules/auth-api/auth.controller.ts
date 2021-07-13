import { Body, Controller, Post, UsePipes, Res } from '@nestjs/common';
import { PasswordHashPipe } from './passwordHash.pipe';
import { UsersService } from '../users/users.service';
import { AuthService } from '../auth/auth.service';
import * as roles from 'src/consts/roles';
import { ProtectWithRoles } from 'src/common/auth/protect-with-roles.decorator';

@Controller('/api')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @Post('/auth/login')
  @ProtectWithRoles(roles.ANONYMOUS)
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
  @ProtectWithRoles(roles.REGISTERED)
  async logout(@Res() res) {
    res.clearCookie('jwt');
    return res.sendStatus(200);
  }

  @Post('/client/register')
  @ProtectWithRoles(roles.ANONYMOUS)
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
