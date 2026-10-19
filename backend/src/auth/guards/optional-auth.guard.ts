import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { fromNodeHeaders } from 'better-auth/node';
import { BETTER_AUTH, type BetterAuthInstance } from '../auth.config.js';
import type { AuthenticatedUser, RequestWithUser } from '../auth.interface.js';

@Injectable()
export class OptionalAuthGuard implements CanActivate {
  constructor(
    @Inject(BETTER_AUTH) private readonly auth: BetterAuthInstance,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<RequestWithUser>();

    try {
      const sessionData = await this.auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
      });

      if (sessionData?.user) {
        req.user = sessionData.user as unknown as AuthenticatedUser;
        req.session = sessionData.session as any;
      }
    } catch {
      // Anonymous visitor - no error thrown
    }

    return true;
  }
}
