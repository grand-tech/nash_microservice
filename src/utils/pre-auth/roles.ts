import { SetMetadata } from '@nestjs/common';

/**
 * List of roles supported in the system.
 */
export enum Role {
  User = 'User',
  Admin = 'Admin',
}

export const ROLES_KEY = 'roles';

/**
 * Decorator used to dictate permited roles in a route.
 * @param roles the lis of roles permited for the endpoint.
 * @returns
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
