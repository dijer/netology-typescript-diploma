import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login({ email, password }): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    const isPasswordMatch = await bcrypt.compare(password, user.passwordHash);
    if (isPasswordMatch) {
      const jwt = this.jwtService.sign({
        id: user._id,
        role: user.role,
      });

      return {
        token: jwt,
        email,
        name: user.name,
        contactPhone: user.contactPhone,
      };
    }
    throw new UnauthorizedException();
  }
}
