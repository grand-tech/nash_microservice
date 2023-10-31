import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, Role } from './roles';
import { User } from 'src/datatypes/user/user';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) { }

  /**
   * Performs RBAC on all routes.
   * @param context the request context.
   * @returns true if the role is valid.
   */
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // means that route can be accessed by anyone.
    if (!requiredRoles) {
      return true;
    }

    // get the user details from the request context.
    const x = context.switchToHttp().getNext();
    const u = x.req.raw.user as User;

    // do the rbac.
    return requiredRoles.some((role) => {
      return (u?.labels ?? []).includes(role.toString());
    });
  }
}
