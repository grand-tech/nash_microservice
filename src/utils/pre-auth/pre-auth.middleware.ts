import { Injectable, NestMiddleware } from '@nestjs/common';
import { auth } from 'firebase-admin';
import { FirebaseAuthService } from '../firebase-auth/firebase-auth.service';
import { FastifyRequest, FastifyReply } from 'fastify';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { UsersService } from '../../users/users.service';

@Injectable()
export class PreAuthMiddleware implements NestMiddleware {
  /**
   * Instance of the firebase app.
   */
  private firebaseAuth: auth.Auth;

  constructor(
    private firebaseAuthService: FirebaseAuthService,
    private readonly userService: UsersService,
  ) {
    this.firebaseAuth = this.firebaseAuthService.getAuth();
  }

  use(req: FastifyRequest['raw'], res: FastifyReply['raw'], next: () => void) {
    const token = (req.headers.authorization ?? '').replace('Bearer ', '');

    if (token != null && token != '') {
      this.firebaseAuth
        .verifyIdToken(token)
        .then(async (decodedToken: DecodedIdToken) => {
          req['firebaseUser'] = {
            email: decodedToken.email,
            feduid: decodedToken.uid,
            phoneNumber: decodedToken.phone_number,
          };

          const dbUser = await this.userService.getUser(decodedToken.uid);
          req['feduid'] = decodedToken.uid;
          req['user'] = dbUser;

          next();
        })
        .catch((reason: any) => {
          next();
        });
    } else {
      next();
    }
  }

  // private static accessDenied(url: string, res: FastifyReply['raw']) {
  //   res.statusCode
    
    
  //   // .status(403).json({
  //   //   statusCode: 403,
  //   //   timestamp: new Date().toISOString(),
  //   //   path: url,
  //   //   message: 'access denied',
  //   // });
  // }
}
