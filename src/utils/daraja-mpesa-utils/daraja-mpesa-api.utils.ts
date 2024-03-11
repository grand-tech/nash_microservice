import express, { Request, Response } from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import axios from 'axios';
import moment from 'moment';
import apiRouter from './api';
import cors from 'cors';
import fs from 'fs';

const app = express();
const port = 5000;
const hostname = 'localhost';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use('/', apiRouter);

const server = http.createServer(app);

async function getAccessToken(): Promise<string> {
  const consumer_key = 'QL7dirVlvQ4soyJrwycgcxdwq1LaZM14dUvsYYPM5OyBLAzC';
  const consumer_secret =
    'Pm7h6D00Az2HXIdHxvGvB5cmcZLn0X7VSwmJsZnrUrsJBkoetQMN3mG4GLkCfWgr';
  const url =
    'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
  const auth: string =
    'Basic ' +
    Buffer.from(consumer_key + ':' + consumer_secret).toString('base64');

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: auth,
      },
    });

    const dataresponse: any = response.data;
    const accessToken: string = dataresponse.access_token;
    return accessToken;
  } catch (error) {
    throw error;
  }
}

app.get('/', (req: Request, res: Response) => {
  res.send('MPESA DARAJA API B2C TEST');
  const timeStamp: string = moment().format('YYYYMMDDHHmmss');
  console.log(timeStamp);
});

app.get('/access_token', (req: Request, res: Response) => {
  getAccessToken()
    .then(accessToken => {
      res.send('😀 Your access token is ' + accessToken);
    })
    .catch(console.log);
});

app.get('/stkpush', (req: Request, res: Response) => {
  getAccessToken()
    .then(accessToken => {
      const url =
        'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';
      const auth: string = 'Bearer ' + accessToken;
      const timestamp: string = moment().format('YYYYMMDDHHmmss');
      const password: string = Buffer.from(
        '174379' +
          'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919' +
          timestamp
      ).toString('base64');

      axios
        .post(
          url,
          {
            BusinessShortCode: '174379',
            Password: password,
            Timestamp: timestamp,
            TransactionType: 'CustomerPayBillOnline',
            Amount: '10',
            PartyA: '254796259104',
            PartyB: '174379',
            PhoneNumber: '254796259104',
            CallBackURL: 'https://mydomain.com/path',
            AccountReference: 'UMESKIA PAY',
            TransactionDesc: 'Mpesa Daraja API stk push test',
          },
          {
            headers: {
              Authorization: auth,
            },
          }
        )
        .then(response => {
          res.send(
            '😀 Request is successful done ✔✔. Please enter mpesa pin to complete the transaction'
          );
        })
        .catch(error => {
          console.log(error);
          res.status(500).send('Request failed');
        });
    })
    .catch(console.log);
});

app.post('/callback', (req: Request, res: Response) => {
  console.log('STK PUSH CALLBACK');
  const CheckoutRequestID: string = req.body.Body.stkCallback.CheckoutRequestID;
  const ResultCode: string = req.body.Body.stkCallback.ResultCode;
  const json: string = JSON.stringify(req.body);
  fs.writeFile('stkcallback.json', json, 'utf8', function (err) {
    if (err) {
      return console.log(err);
    }
    console.log('STK PUSH CALLBACK JSON FILE SAVED');
  });
  console.log(req.body);
});

app.get('/registerurl', (req: Request, res: Response) => {
  getAccessToken()
    .then(accessToken => {
      const url = 'https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl';
      const auth: string = 'Bearer ' + accessToken;
      axios
        .post(
          url,
          {
            ShortCode: '174379',
            ResponseType: 'Complete',
            ConfirmationURL: 'http://example.com/confirmation',
            ValidationURL: 'http://example.com/validation',
          },
          {
            headers: {
              Authorization: auth,
            },
          }
        )
        .then(response => {
          res.status(200).json(response.data);
        })
        .catch(error => {
          console.log(error);
          res.status(500).send('Request failed');
        });
    })
    .catch(console.log);
});

app.get('/confirmation', (req: Request, res: Response) => {
  console.log('All transactions will be sent to this URL');
  console.log(req.body);
});

app.get('/validation', (req: Request, res: Response) => {
  console.log('Validating payment');
  console.log(req.body);
});

app.get('/b2curlrequest', (req: Request, res: Response) => {
  getAccessToken()
    .then(accessToken => {
      const securityCredential =
        'iusQuWQ1zn6rD45UjSMVHiGnPuy8rpDCucxzRqAre2G1bEZST4hymGtETXDUVpZFQc/ATimpOaqp9LgvzE1lS6834Ttw75kitvWFc8ekoAnd5AjmE2wbtJCG3wcQceuYo55Tf113jG61s5ksxMMLnxIWuUsmg3ejaTtzhJhLSUmgLbvYi81XPmYL5oy9si7QC+YX92TcKZEvz3gwb+b28El8nsNaEjGTVdHSGU+eHNpgoO/fbZ7J5NrpA3lvzTAThDLOTNsbxEA5o20BZxaqvkEtXFWJKy8XMALU6mGkJxT+UrEfk69XAqqf03fpF9qk8YZdvRlJKYjDEYcWDVFkxA==';
      const url = 'https://sandbox.safaricom.co.ke/mpesa/b2c/v1/paymentrequest';
      const auth: string = 'Bearer ' + accessToken;
      axios
        .post(
          url,
          {
            InitiatorName: 'testapi',
            SecurityCredential: securityCredential,
            CommandID: 'PromotionPayment',
            Amount: '1',
            PartyA: '600996',
            PartyB: '254796259104',
            Remarks: 'Withdrawal',
            QueueTimeOutURL: 'https://mydomain.com/b2c/queue',
            ResultURL: 'https://mydomain.com/b2c/result',
            Occasion: 'Withdrawal',
          },
          {
            headers: {
              Authorization: auth,
            },
          }
        )
        .then(response => {
          res.status(200).json(response.data);
        })
        .catch(error => {
          console.log(error);
          res.status(500).send('Request failed');
        });
    })
    .catch(console.log);
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
