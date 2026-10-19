import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import type { UserRole } from '../auth.interface.js';

export class UpdateRoleDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['student', 'staff', 'admin'], {
    message: 'Role must be one of: student, staff, admin',
  })
  role!: UserRole;
}
