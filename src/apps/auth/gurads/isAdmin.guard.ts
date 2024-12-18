import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { Observable } from 'rxjs';

@Injectable()
export class IsAdminGuard implements CanActivate {
  constructor() {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    if (request.persona.role != UserRole.ADMIN)
      throw new UnauthorizedException(
        'Not Authorized Access For This Operation',
      );

    return true;
  }
}
