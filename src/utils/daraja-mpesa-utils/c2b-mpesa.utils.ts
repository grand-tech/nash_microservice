import express, { Request, Response } from "express";
import http from "http";
import bodyParser from "body-parser";
import axios, { AxiosResponse } from "axios";
import moment from "moment";
import cors from "cors";

const app = express();
const server = http.createServer(app);
const port: number = 5000;
const hostname: string = "localhost";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

async function getAccessToken(): Promise<string> {
  const consumer_key: string = "QL7dirVlvQ4soyJrwycgcxdwq1LaZM14dUvsYYPM5OyBLAzC";
  const consumer_secret: string = "Pm7h6D00Az2HXIdHxvGvB5cmcZLn0X7VSwmJsZnrUrsJBkoetQMN3mG4GLkCfWgr";
  const url: string = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
  const auth: string = "Basic " + Buffer.from(`${consumer_key}:${consumer_secret}`).toString("base64");

  try {
    const response: AxiosResponse<any> = await axios.get(url, {
      headers: {
        Authorization: auth,
      },
    });
    const accessToken: string = response.data.access_token;
    return accessToken;
  } catch (error) {
    throw error;
  }
}

app.get("/", (req: Request, res: Response) => {
  res.send("MPESA DARAJA API B2C TEST");
  const timeStamp: string = moment().format("YYYYMMDDHHmmss");
  console.log(timeStamp);
});

app.get("/access_token", (req: Request, res: Response) => {
  getAccessToken()
    .then((accessToken: string) => {
      res.send("😀 Your access token is " + accessToken);
    })
    .catch(console.log);
});

app.get("/b2curlrequest", (req: Request, res: Response) => {
  getAccessToken()
    .then((accessToken: string) => {
      const securityCredential: string = "N3Lx/hW49XHYpwlVICN1FqaMQsWkuNL8hHaCVGe6ECX5BLgjjUkKxuDNbeZFID8IqL7sa59/Fhg5LFVWJ3FhamKur/bmbFDHiUJ2KwqVeOlSClDK4nCbRIfrqJ+jQZsWqrXcMd0o3B2ehRIBxExNL9rqouKUKuYyKtTEEKggWPgg81oPhxQ8qTSDMROLoDhiVCKR6y77lnHZ0NU83KRU4xNPy0hRcGsITxzRWPz3Ag+qu/j7SVQ0s3FM5KqHdN2UnqJjX7c0rHhGZGsNuqqQFnoHrshp34ac/u/bWmrApUwL3sdP7rOrb0nWasP7wRSCP6mAmWAJ43qWeeocqrz68TlPDIlkPYAT5d9QlHJbHHKsa1NA==";
      const url: string = "https://sandbox.safaricom.co.ke/mpesa/b2c/v1/paymentrequest";
      const auth: string = "Bearer " + accessToken;

      axios
        .post(
          url,
          {
            InitiatorName: "testapi",
            SecurityCredential: securityCredential,
            CommandID: "PromotionPayment",
            Amount: "1",
            PartyA: "600996",
            PartyB: "254796259104",
            Remarks: "Withdrawal",
            QueueTimeOutURL: "https://mydomain.com/b2c/queue",
            ResultURL: "https://mydomain.com/b2c/result",
            Occasion: "Withdrawal",
          },
          {
            headers: {
              Authorization: auth,
            },
          }
        )
        .then((response: AxiosResponse<any>) => {
          res.status(200).json(response.data);
        })
        .catch((error: any) => {
          console.log(error);
          res.status(500).send("❌ Request failed");
        });
    })
    .catch(console.log);
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
