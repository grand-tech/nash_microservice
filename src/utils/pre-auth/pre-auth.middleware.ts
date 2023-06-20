import { Injectable, NestMiddleware } from '@nestjs/common';
import { auth } from 'firebase-admin';
import { FirebaseAuthService } from '../firebase-auth/firebase-auth.service';
import { Request, Response } from 'express';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';

@Injectable()
export class PreAuthMiddleware implements NestMiddleware {

  /**
    * Instance of the firebase app.
    */
  private firebaseAuth: auth.Auth;


  constructor(private firebaseAuthService: FirebaseAuthService) {
    this.firebaseAuth = firebaseAuthService.getAuth()
  }

  use(req: Request, res: Response, next: () => void) {

    const token = req.headers.authorization;

    if (token != null && token != '') {
      this.firebaseAuth.verifyIdToken(token.replace('Bearer ', ''))
      .then(async (decodedToken: DecodedIdToken) => {
        req['user'] = {
          email: decodedToken.email,
          feduid: decodedToken.uid
        }

        // Query user details from database.

        next();
      }).catch(() => {
        PreAuthMiddleware.accessDenied(req.url, res)
      })
    } else {
      PreAuthMiddleware.accessDenied(req.url, res)
    }

   
  }

  private static accessDenied(url: string, res: Response) {
    res.status(403).json({
      statusCode: 403,
      timestamp: new Date().toISOString(),
      path: url,
      message: 'access denied',
    });
  }
}
