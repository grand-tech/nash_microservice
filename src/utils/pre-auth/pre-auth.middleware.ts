import { Injectable, NestMiddleware } from '@nestjs/common';
import { auth } from 'firebase-admin';
import { FirebaseAuthService } from '../firebase-auth/firebase-auth.service';
import { FastifyRequest, FastifyReply } from 'fastify';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { User, nodeToUser } from '../../datatypes/user/user';
import { Neo4jService } from 'nest-neo4j/dist';

@Injectable()
export class PreAuthMiddleware implements NestMiddleware {
  /**
   * Instance of the firebase app.
   */
  private firebaseAuth: auth.Auth;

  /**
   *
   * @param firebaseAuthService
   * @param userService
   */
  constructor(
    private firebaseAuthService: FirebaseAuthService,
    private readonly neo4j: Neo4jService
  ) {
    this.firebaseAuth = this.firebaseAuthService.getAuth();
  }

  /**
   *
   * @param req
   * @param res
   * @param next
   */
  use(req: FastifyRequest, res: FastifyReply, next: () => void) {
    const token = (req.headers.authorization ?? '').replace('Bearer ', '');

    if (token != null && token != '') {
      this.firebaseAuth
        .verifyIdToken(token)
        .then(async (decodedToken: DecodedIdToken) => {
          const dbUser = await this.getUser(decodedToken.uid);
          req['feduid'] = decodedToken.uid;
          req['user'] = dbUser;
          next();
        })
        .catch((reason: any) => {
          console.error(reason);
          next();
        });
    } else {
      next();
    }
  }

  /**
   * Queries for user information given their feduidd.
   * @param feduid the user`s feduid.
   * @return the queried user.
   */
  async getUser(feduid: string) {
    const rst = await this.neo4j.read(
      'MATCH (user:User) WHERE user.feduid = $feduid RETURN user',
      { feduid: feduid }
    );

    if (rst.records.length > 0) {
      const usr = rst.records[0].get('user');
      return nodeToUser(usr);
    } else {
      return new User();
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
