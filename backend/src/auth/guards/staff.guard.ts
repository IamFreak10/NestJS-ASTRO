import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import type { RequestWithUser } from '../auth.interface.js';

@Injectable()
export class StaffGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<RequestWithUser>();
    const role = req.user?.role;

    if (role !== 'staff' && role !== 'admin') {
      throw new ForbiddenException('Staff or administrator access required');
    }

    return true;
  }
}

