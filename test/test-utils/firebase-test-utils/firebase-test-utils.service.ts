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

    console.log('===============>');

    const body = JSON.stringify({
      email: email,
      password: pass,
      returnsecureToken: true,
    });

    const r: AxiosRequestConfig = {
      // params: {
      //   key: 'AIzaSyCPvjk38KbXZub-82Zjp3K9XCTDFFmQrkQ',
      // },
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const url =
      'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyCPvjk38KbXZub-82Zjp3K9XCTDFFmQrkQ';

    const rsp = await this.httpService.axiosRef.post(url, body, r);

    if (rsp.status == 200) {
      user.feduid = rsp.data.localId;
      user.skey = rsp.data.idToken;
    }

    console.log('====>', rsp.data);
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
