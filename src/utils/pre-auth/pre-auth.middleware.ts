import { Injectable, NestMiddleware } from '@nestjs/common';
import { auth } from 'firebase-admin';
import { Logger } from '../common/common.utils';
import { FirebaseUsersUtils } from '../firebase/firebase-auth.service';
import { Request, Response } from 'express';
import { BaseUtils } from '../common/base.utils';
import { UsersService } from '../../users/users.service';

@Injectable()
export class PreAuthMiddleware implements NestMiddleware {
  /**
   * Instance of the firebase app.
   */
  private firebaseUsersUtils: FirebaseUsersUtils;

  constructor(
    private readonly firebaseUserService: FirebaseUsersUtils,
    private readonly userService: UsersService,
  ) {
    this.firebaseUsersUtils = firebaseUserService;
  }

  use(req: Request, res: Response, next: () => void) {
    const token = (req.headers.authorization ?? '').replace('Bearer ', '');

    if (token != null && token != '') {
      this.firebaseUserService.verifyToken(token).then(
        (decodedToken: auth.DecodedIdToken) => {
          req['firebaseUser'] = {
            email: decodedToken.email,
            uid: decodedToken.uid,
            phoneNumber: decodedToken.phone_number,
          };
          this.userService
            .getUserByUid(decodedToken.uid)
            .then((user) => {
              if (user != null) {
                req['user'] = user;
                next();
              }
            })
            .catch((e) => {
              Logger.error(e);
              PreAuthMiddleware.accessDenied(req.url, res);
            });
        },
        (e) => {
          Logger.error(e);
          PreAuthMiddleware.accessDenied(req.url, res);
        },
      );
    } else {
      next();
    }
  }

  private static accessDenied(url: string, res: Response) {
    res.status(403).json(BaseUtils.getResponse1(403, 'access denied'));
  }
}
