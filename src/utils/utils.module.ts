import { Module } from '@nestjs/common';
import { FirebaseAuthService } from './firebase-auth/firebase-auth.service';
import { PreAuthMiddleware } from './pre-auth/pre-auth.middleware';
import { UsersModule } from '../users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './pre-auth/roles.guard';

@Module({
  imports: [UsersModule],
  providers: [
    FirebaseAuthService,
    PreAuthMiddleware,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [PreAuthMiddleware, FirebaseAuthService],
})
export class UtilsModule {}
