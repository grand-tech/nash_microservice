import { User } from 'src/datatypes/user/user';
import { PurchaseAirtimeService } from './services/purchase-airtime.service';
import { RequestFundsService } from './services/request-funds.service';
import { SendFundsService } from './services/send-funds.service';
import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { Roles, Role } from '../utils/pre-auth/roles';
import { FundsRequestResponse, TransactionResponse } from '../utils/response';

@Resolver()
export class TransactionsResolver {
  constructor(
    private readonly airtimeService: PurchaseAirtimeService,
    private readonly requestFundsService: RequestFundsService,
    private readonly sendFundsService: SendFundsService,
  ) { }

  @Mutation((returns) => TransactionResponse)
  @Roles(Role.User)
  async sendUsd(
    @Args('recipientPhoneNumber') recipientPhoneNumber: string,
    @Args('usdAmount') usdAmount: number,
    @Args('description') description: string,
    @Context() context,
  ): Promise<TransactionResponse> {
    const user: User = context.req.raw.user as User;
    return await this.sendFundsService.validateSendFunds(
      user,
      usdAmount,
      recipientPhoneNumber,
      description,
    );
  }

  @Mutation((returns) => FundsRequestResponse)
  @Roles(Role.User)
  async requestFunds(
    @Args('targetPhoneNumber') targetPhoneNumber: string,
    @Args('usdAmount') usdAmount: number,
    @Args('description') description: string,
    @Context() context,
  ): Promise<FundsRequestResponse> {
    const user: User = context.req.raw.user as User;
    return await this.requestFundsService.validateFundsRequest(
      user,
      usdAmount,
      targetPhoneNumber,
      description,
    );
  }

  @Mutation((returns) => TransactionResponse)
  @Roles(Role.User)
  async fulfillFundsRequest(
    @Args('requestID') requestID: number,
    @Context() context,
  ): Promise<TransactionResponse> {
    const user: User = context.req.raw.user as User;
    return await this.requestFundsService.fulfillFundsRequest(
      user,
      requestID
    );
  }
}
