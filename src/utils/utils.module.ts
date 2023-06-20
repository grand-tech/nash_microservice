import { Module } from '@nestjs/common';
import { FirebaseAuthService } from './firebase-auth/firebase-auth.service';
import { PreAuthMiddleware } from './pre-auth/pre-auth.middleware';

@Module({
    imports: [],
    providers: [FirebaseAuthService,PreAuthMiddleware],
    exports: [PreAuthMiddleware, FirebaseAuthService]
})
export class UtilsModule {}

export interface User {
    id: number,
    name: string,
    email: string,
    phoneNumber: string,
    feduid: string
}