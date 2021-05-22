import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';

export const Roles = (...roles: string[]) =>
  applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(JwtAuthGuard, RolesGuard),
  );
