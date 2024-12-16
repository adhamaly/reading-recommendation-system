import { UserRole } from '@prisma/client';

export interface UserJwtPersona {
  id: number;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}
