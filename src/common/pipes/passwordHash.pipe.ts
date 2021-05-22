import { Injectable, PipeTransform } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

const saltOrRounds = +process.env.SALT;

@Injectable()
export class PasswordHashPipe implements PipeTransform {
  async transform(data: any) {
    const { password, ...rest } = data;
    if (typeof password === 'string' && password.length) {
      const passwordHash = await bcrypt.hash(password, saltOrRounds);
      return {
        ...rest,
        passwordHash,
      };
    }
    return data;
  }
}
