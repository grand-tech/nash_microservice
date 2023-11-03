import { StableToken } from '@celo/base';
import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { TransactionRequest, nodeToTransactionRequest } from '../../datatypes/transaction/transaction.request';
import { User } from '../../datatypes/user/user';
import { UsersService } from '../../users/users.service';
import { TransactionRequestResponse } from '../../utils/response';

@Injectable()
export class RequestFundsService {
  constructor(
    private readonly neo4j: Neo4jService,
    private readonly userService: UsersService
  ) { }

  /**
   * Validation of the send request transaction.
   * @param initiator the initiator of the transaction request.
   * @param amountUSD the amount requested.
   * @param targetPhoneNumber the target phone number.
   * @param description the description of the request.
   * @returns the result of the transaction request creation process.
   */
  async validateSendRequestFunds(
    initiator: User,
    amountUSD: number,
    targetPhoneNumber: string,
    description: string,
  ): Promise<TransactionRequestResponse> {
    const response: TransactionRequestResponse = {
      status: 200,
      message: 'Success',
      body: undefined,
    };

    if (amountUSD <= 0) {
      response.status = 501;
      response.message = 'Invalid amount should be greater 0.';
    } else {
      // query recipient
      if ((targetPhoneNumber ?? '').length < 7) {
        response.status = 502;
        response.message = 'Invalid phone number.';
      } else {
        const target = await this.userService.getUserByPhoneNumber(
          targetPhoneNumber,
        );
        if (target.phoneNumber == targetPhoneNumber) {
          const tx = await this.requestFundsCypherQry(
            amountUSD,
            description,
            initiator,
            target,
          );
          const transaction = nodeToTransactionRequest(tx.records[0].get('tx'));
          // Recipient does not exist.
          response.body = transaction;
          if (transaction.id > 0) {
            response.message = 'Transaction request failed!!';
            response.status = 503;
          }
        } else {
          response.status = 504;
          response.message = 'Account with phone number does not exist.';
        }
      }
    }

    return response;
  }

  /**
   * Allows users to request for funds from another account.
   * @param usdAmount the amount of money to be sent in dollars.
   * @param description the description of the request.
   * @param initiator the initiator details.
   * @param target the target details.
   */
  async requestFundsCypherQry(
    usdAmount: number,
    description: string,
    initiator: User,
    target: User,
  ) {
    const tx: TransactionRequest = new TransactionRequest();

    tx.amount = usdAmount;
    tx.description = description;
    tx.network = 'CELO';
    tx.stableCoin = StableToken.cUSD;


    const r: Record<string, any> = tx;
    r.initiatorFeduid = initiator.feduid;
    r.initiatorAddress = initiator.publicAddress;
    r.targetFeduid = target.feduid;
    r.todaysTimestamp = 1234567890;
    r.timestamp = 1234567890;

    const transactionRequest = await this.neo4j.write(
      'MATCH (initiator: User) MATCH (target: User) ' +
      ' WHERE initiator.feduid = $initiatorFeduid AND target.feduid = $targetFeduid ' +
      ' MERGE (initiator)-[:REQUESTED_FUNDS_ON]->(initiatorDay: Day {timestamp: $todaysTimestamp}) ' +
      ' MERGE (target)-[:REQUESTED_FUNDS_ON]->(targetDay: Day {timestamp: $todaysTimestamp}) ' +
      ' CREATE (initiatorDay)-[:RECORDED]->(tx:TransactionRequest { ' +
      '     description: $description, ' +
      '     amount: $amount, ' +
      '     stableCoin: $stableCoin, ' +
      '     network: $network, ' +
      '     initiatorAddress: $initiatorAddress, ' +
      '     timestamp: $timestamp,' +
      '     fulfilled: false' +
      ' })<-[:RECORDED]-(targetDay) ' +
      ' return tx, initiatorDay, targetDay, initiator, target',
      tx,
    );

    return transactionRequest;
  }
}
