import { Module } from '@nestjs/common';
import { DataTypesModule } from '../datatypes/datatypes.module';
import { SendFundsService } from './services/send-funds.service';
import { PurchaseAirtimeService } from './services/purchase-airtime.service';
import { RequestFundsService } from './services/request-funds.service';
import { TransactionsController } from './transactions.controller';
import { MPesaApisService } from './services/m-pesa-apis.service';

@Module({
  imports: [DataTypesModule],
  providers: [SendFundsService, PurchaseAirtimeService, RequestFundsService, MPesaApisService],
  exports: [],
  controllers: [TransactionsController],
})
export class TransactionsModule {}
