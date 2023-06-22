import { Module } from '@nestjs/common';
import { FirebaseAuthService } from './firebase-auth/firebase-auth.service';
import { PreAuthMiddleware } from './pre-auth/pre-auth.middleware';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule],
  providers: [FirebaseAuthService, PreAuthMiddleware],
  exports: [PreAuthMiddleware, FirebaseAuthService],
})
export class UtilsModule {}
