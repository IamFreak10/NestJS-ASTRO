import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class StaffGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const staffKey = request.headers['staff-key'];
    if (staffKey !== 'helpdesk-staff-secret') {
      throw new ForbiddenException(`Missing staff key`);
    }
    return true;
  }
}
