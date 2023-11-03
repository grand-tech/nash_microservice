import { Module } from '@nestjs/common';
import { DataTypesModule } from '../datatypes/datatypes.module';
import { SendFundsService } from './services/send-funds.service';
import { PurchaseAirtimeService } from './services/purchase-airtime.service';
import { RequestFundsService } from './services/request-funds.service';
import { MPesaApisService } from './services/m-pesa-apis.service';
import { UsersModule } from '../users/users.module';
import { HttpModule } from '@nestjs/axios';
import { TransactionsResolver } from './transactions.resolver';

@Module({
  imports: [DataTypesModule, UsersModule, HttpModule],
  providers: [
    SendFundsService,
    PurchaseAirtimeService,
    RequestFundsService,
    MPesaApisService,

    // resolver
    TransactionsResolver
  ],
  exports: [],
  controllers: [],
})
export class TransactionsModule { }
