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
  async auth(email: string, pass: string): Promise<string> {
    const body = JSON.stringify({
      email: email,
      password: pass,
      returnsecureToken: true,
    });

    const r: AxiosRequestConfig = {
      params: {
        key: 'AIzaSyBN2Dp9d41IiS7RP_8pa2akd8SCPBMjJlY',
      },
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const url =
      'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword';

    const rsp = await this.httpService.axiosRef.post(url, body, r);

    if (rsp.status == 200) {
      return rsp.data.idToken;
    } else {
      return '';
    }
  }
}
