import { Module } from '@nestjs/common';
import { DataTypesModule } from '../datatypes/datatypes.module';
import { SendFundsService } from './services/send-funds.service';
import { PurchaseAirtimeService } from './services/purchase-airtime.service';
import { RequestFundsService } from './services/request-funds.service';
import { TransactionsController } from './transactions.controller';

@Module({
  imports: [DataTypesModule],
  providers: [SendFundsService, PurchaseAirtimeService, RequestFundsService],
  exports: [],
  controllers: [TransactionsController],
})
export class TransactionsModule {}
