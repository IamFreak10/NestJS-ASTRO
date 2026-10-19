import {
  All,
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { toNodeHandler } from 'better-auth/node';
import { BETTER_AUTH, type BetterAuthInstance } from './auth.config.js';
import { AuthService } from './auth.service.js';
import { AuthGuard, CurrentUser } from './guards/auth.guard.js';
import { AdminGuard } from './guards/admin.guard.js';
import { UpdateRoleDto } from './dto/update-role.dto.js';
import type { AuthenticatedUser } from './auth.interface.js';

@Controller('auth')
export class AuthController {
  private readonly authHandler: (req: Request, res: Response) => Promise<void>;

  constructor(
    @Inject(BETTER_AUTH) private readonly auth: BetterAuthInstance,
    private readonly authService: AuthService,
  ) {
    this.authHandler = toNodeHandler(this.auth);
  }

  /**
   * Return currently authenticated user profile
   */
  @Get('me')
  @UseGuards(AuthGuard)
  getMe(@CurrentUser() user: AuthenticatedUser) {
    return user;
  }

  /**
   * Admin-only endpoint to promote or demote user roles
   */
  @Patch('users/:id/role')
  @UseGuards(AuthGuard, AdminGuard)
  async updateUserRole(
    @Param('id') userId: string,
    @Body() dto: UpdateRoleDto,
    @CurrentUser() adminUser: AuthenticatedUser,
  ) {
    return this.authService.updateUserRole(userId, dto.role, adminUser);
  }

  /**
   * Better Auth endpoints (/api/auth/sign-in/email, /api/auth/sign-up/email, /api/auth/sign-out, etc.)
   */
  @All('{*path}')
  async handleBetterAuthCatchAll(@Req() req: Request, @Res() res: Response) {
    return this.authHandler(req, res);
  }

  @All()
  async handleBetterAuthRoot(@Req() req: Request, @Res() res: Response) {
    return this.authHandler(req, res);
  }
}
