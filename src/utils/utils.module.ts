import { Module } from '@nestjs/common';
import { FirebaseUsersUtils } from './firebase/firebase-auth.service';
import { PreAuthMiddleware } from './pre-auth/pre-auth.middleware';
import { UsersModule } from '../users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './pre-auth/roles.guard';

@Module({
  imports: [UsersModule],
  providers: [
    FirebaseUsersUtils,
    PreAuthMiddleware,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [PreAuthMiddleware, FirebaseUsersUtils],
})
export class UtilsModule {}
