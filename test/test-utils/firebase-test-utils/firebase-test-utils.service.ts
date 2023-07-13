import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';

@Injectable()
export class FirebaseTestUtilsService {
  constructor(private httpService: HttpService) {}

  /**
   * Authenticates the user for testing.
   * @param email the email address.
   * @param pass the user password.
   */
  async auth(email: string, pass: string): Promise<FirebaseTestUser> {
    const user: FirebaseTestUser = {
      feduid: '',
      skey: '',
    };

    const body = JSON.stringify({
      email: email,
      password: pass,
      returnsecureToken: true,
    });

    const r: AxiosRequestConfig = {
      params: {
        key: 'AIzaSyB-URSLaBLZ_roSBeiz_JUD83v_pc2ze9g',
      },
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const url =
      'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword';

    const rsp = await this.httpService.axiosRef.post(url, body, r);

    if (rsp.status == 200) {
      user.feduid = rsp.data.localId;
      user.skey = rsp.data.idToken;
    }

    return user;
  }
}

/**
 * Contains necessary data from identity toolkit.
 * @param feduid the users feduid.
 * @param skey the key used as bearer token.
 */
export interface FirebaseTestUser {
  feduid: string;
  skey: string;
}
