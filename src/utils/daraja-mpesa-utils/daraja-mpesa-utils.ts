// app.ts
import express, { Request, Response } from 'express';
import unirest, { Response as UnirestResponse } from 'unirest';

const app = express();

const PORT = 3000;

// Route to handle the MPesa payment request
app.get('/makePayment', (req: Request, res: Response) => {
  // MPesa payment request
  let request = unirest.post('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest')
    .headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer 5KugKPzXNWwGxB2D2EZPIFmMSdtG'
    })
    .send({
      "BusinessShortCode": 174379,
      "Password": "MTc0Mzc5YmZiMjc5ZjlhYTliZGJjZjE1OGU5N2RkNzFhNDY3Y2QyZTBjODkzMDU5YjEwZjc4ZTZiNzJhZGExZWQyYzkxOTIwMjQwMzAxMDgxMDQw",
      "Timestamp": "20240301081040",
      "TransactionType": "CustomerPayBillOnline",
      "Amount": 1,
      "PartyA": 254796259104,
      "PartyB": 174379,
      "PhoneNumber": 254796259104,
      "CallBackURL": "https://mydomain.com/path",
      "AccountReference": "CompanyXLTD",
      "TransactionDesc": "Payment of X"
    })
    .end((response: UnirestResponse) => {
      if (response.error) {
        console.error(response.error);
        res.status(500).send('Internal Server Error');
      } else {
        console.log(response.raw_body);
        res.send('Payment request sent successfully!');
      }
    });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
