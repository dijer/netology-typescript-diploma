import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as jwt from 'jsonwebtoken';
import { CLIENT } from 'src/conts/roles';

@Injectable()
export class SearchInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const request = context.switchToHttp().getRequest();
        const authorization = request.headers.authorization;
        if (!authorization) {
          return {
            ...data,
            isEnabled: true,
          };
        }
        const token = authorization.replace(/Bearer /, '');
        const payload: any = jwt.verify(token, process.env.JWT_SECRET);
        const { role } = payload;
        if (role === CLIENT) {
          return {
            ...data,
            isEnabled: true,
          };
        }
        return data;
      }),
    );
  }
}
