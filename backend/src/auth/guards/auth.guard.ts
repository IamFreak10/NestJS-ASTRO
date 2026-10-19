import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
  createParamDecorator,
} from '@nestjs/common';
import { fromNodeHeaders } from 'better-auth/node';
import { BETTER_AUTH, type BetterAuthInstance } from '../auth.config.js';
import type { AuthenticatedUser, RequestWithUser } from '../auth.interface.js';

// Simple parameter decorator: @CurrentUser() user
export const CurrentUser = createParamDecorator(
  (data: keyof AuthenticatedUser | undefined, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<RequestWithUser>();
    const user = req.user;
    if (!user) return null;
    return data ? user[data] : user;
  },
);

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(BETTER_AUTH) private readonly auth: BetterAuthInstance,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<RequestWithUser>();

    // Better Auth checks cookies or Authorization header directly
    const sessionData = await this.auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!sessionData?.user) {
      throw new UnauthorizedException('Authentication required. Please login.');
    }

    req.user = sessionData.user as unknown as AuthenticatedUser;
    req.session = sessionData.session as any;
    return true;
  }
}
