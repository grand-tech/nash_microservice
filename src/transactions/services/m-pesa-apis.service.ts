import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { Buffer } from 'buffer';
import date from 'date-and-time';

@Injectable()
export class MPesaApisService {
  mpesaURL = '';

  constructor(private readonly http: HttpService) {
    this.mpesaURL = 'https://sandbox.safaricom.co.ke';
  }

  async getAuthorization() {
    // TODO :Should go to environment variables.
    const MPesaConsumerKey = '9QRo4KXV1BKp64GWNLfzNCFil7Uwe3gg';
    const mPesaConsumerSecret = 'wrPokJwFQ9ykXOT3';

    const bearerToken = `Basic ${Buffer.from(
      `${MPesaConsumerKey}:${mPesaConsumerSecret}`,
    ).toString('base64')}`;
    try {
      const r: AxiosRequestConfig = {
        headers: {
          Authorization: bearerToken,
        },
      };
      const rsp = await this.http.axiosRef.get(
        'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
        r,
      );

      if (rsp.status == 200) {
        return rsp.data.access_token;
      }
      return '';
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Sends money from nash mpesa account to a user.
   * @param amount the amount of money involved in the transaction.
   * @param feduid the user`s feduid.
   * @param recipientPhoneNumber the phone number receiving the cash.
   * @param transactionId the database record holding the transaction.
   * @returns a response of the btc transaction request.
   */
  async b2cTransaction(
    recipientPhoneNumber: string,
    kshAmount: number,
    feduid: string,
    transactionId: number,
  ) {
    try {
      const authToken = await this.getAuthorization();

      const r: AxiosRequestConfig = {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      };

      const body = {
        InitiatorName: 'Nash Microservice.',
        SecurityCredential:
          'PWz4yEoZpwsoq7gfESZx1efK5qYV/N+ylh0KnsDSOvVWFR906JV1eAYBU8X4hd5/bIHkX3H+ZggeZzFEmhNFF43vLICFDjGUST2Q2izPao8CD4DiJczVm+/97BB34hTeoDee8wwoWu14zOR5l88xWl5WmGiN2EDIaQe/3OO5uAI2A/OAaHNYCjjIDDoSCYQyYSoBK3Sywy+VqY2nujQC9SRC2eQjGA9v3dOBg/F3yEGBllyxx5NIyo6rsItowZAajUYiLHlMg/RNHkX9K4bo5bqIJhwqzNEUm2cCATqhqc3lKwx5Zf8MRNxj2c+xMUvKXs7wzU7grfaI3V3QTwzccw==',
        CommandID: 'BusinessPayment',
        Amount: kshAmount,
        PartyA: 600980,
        PartyB: recipientPhoneNumber,
        Remarks: `${transactionId}#${feduid}`,
        QueueTimeOutURL: 'https://mydomain.com/b2c/queue',
        ResultURL: 'https://mydomain.com/b2c/result',
        Occassion: '',
      };

      const rsp = await this.http.axiosRef.post(
        this.mpesaURL + '/mpesa/b2c/v1/paymentrequest',
        body,
        r,
      );

      if (rsp.status == 200) {
        return rsp.data;
      }

      // {
      //     "ConversationID": "AG_20230720_20102fc0eae9748e2e50",
      //     "OriginatorConversationID": "25019-121393175-1",
      //     "ResponseCode": "0",
      //     "ResponseDescription": "Accept the service request successfully."
      //   }

      return {};
    } catch (error) {
      console.log(error);
      return '';
    }
  }

  /**
   * Initialize an STK push for clients to make payments via mpesa.
   * @param kshAmount the amount to be sold in ksh.
   * @param targetPhoneNumber the phone number to make the payments.
   * @param feduid the user`s federate user id.
   * @param transactionID the transaction id.
   * @returns a response of the STK push request.
   */
  async initSTKPush(
    kshAmount: number,
    targetPhoneNumber: string,
    feduid: string,
    transactionID: number,
  ) {
    try {
      const now = new Date();
      const timestampStr = date.format(now, 'YYYYMMDDhhmmss');
      const shortCode = '174379';
      const passKey =
        'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919';
      const authToken = await this.getAuthorization();

      const r: AxiosRequestConfig = {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      };

      const password = Buffer.from(
        `${shortCode}${passKey}${timestampStr}`,
      ).toString('base64');

      const body = {
        BusinessShortCode: shortCode,
        Password: password,
        Timestamp: `${timestampStr}`,
        TransactionType: 'CustomerPayBillOnline',
        Amount: `${kshAmount}`,
        PartyA: targetPhoneNumber,
        PartyB: '174379',
        PhoneNumber: targetPhoneNumber,
        // TODO register domain to run tests.
        CallBackURL: 'https://mydomain.com/pat',
        AccountReference: `${transactionID}#${feduid}`,
        TransactionDesc: 'Nash MPESA',
      };

      console.log(body);
      const rsp = await this.http.axiosRef.post(
        this.mpesaURL + '/mpesa/stkpush/v1/processrequest',
        body,
        r,
      );

      console.log(rsp.data);
      if (rsp.status == 200) {
        if (rsp.data.ResponseCode == '0') {
          return rsp.data.CheckoutRequestID;
        }
        return '';
      }

      return '';
    } catch (error) {
      console.log(error);
      return '';
    }
  }
}
