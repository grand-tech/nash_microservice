import { Controller } from '@nestjs/common';
import { PurchaseAirtimeService } from './services/purchase-airtime.service';
import { RequestFundsService } from './services/request-funds.service';
import { SendFundsService } from './services/send-funds.service';

@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly airtimeService: PurchaseAirtimeService,
    private readonly requestFundsService: RequestFundsService,
    private readonly sendFundsService: SendFundsService,
  ) {}
}
