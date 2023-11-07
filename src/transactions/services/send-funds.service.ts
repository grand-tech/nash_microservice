import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { UsersService } from '../../users/users.service';
import { User } from '../../datatypes/user/user';
import { sendFunds } from '../../utils/block-chain-utils/contract.kit.utils';
import { StableToken } from '@celo/base';
import {
  Transaction,
  nodeToTransaction,
} from '../../datatypes/transaction/transaction';
import { TransactionResponse } from 'src/utils/response';

@Injectable()
export class SendFundsService {
  constructor(
    private readonly neo4j: Neo4jService,
    private readonly userService: UsersService,
  ) { }

  /**
   * Validates the transaction request and send the money.
   * @param sender the sender.
   * @param amountUSD the amount of money to be sent.
   * @param description the description of the transactions.
   */
  async validateSendFunds(
    sender: User,
    amountUSD: number,
    recipientPhoneNumber: string,
    description: string,
  ): Promise<TransactionResponse> {
    const response: TransactionResponse = {
      status: 200,
      message: 'Success',
      body: undefined,
    };

    if (amountUSD <= 0) {
      response.status = 501;
      response.message = 'Invalid amount should be greater 0.';
    } else {
      // query recipient
      if ((recipientPhoneNumber ?? '').length < 7) {
        response.status = 502;
        response.message = 'Invalid phone number.';
      } else {
        const recipient = await this.userService.getUserByPhoneNumber(
          recipientPhoneNumber,
        );
        if (recipient.phoneNumber == recipientPhoneNumber) {
          const tx = await this.sendcUSD(
            amountUSD,
            description,
            sender,
            recipient,
          );
          const transaction = nodeToTransaction(tx.records[0].get('transaction'));
          // Recipient does not exist.
          response.body = transaction;
          if (!transaction.blockchainTransactionStatus) {
            response.message = 'Transaction failed!!';
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
   * Sends money in usd from one account to another.
   * @param usdAmount the amount of money to be sent in dollars.
   * @param description the transaction description.
   * @param sender the senders details.
   * @param recipient the receipients details.
   */
  async sendcUSD(
    usdAmount: number,
    description: string,
    sender: User,
    recipient: User,
  ) {
    const tx: Transaction = new Transaction();

    tx.amount = usdAmount;
    tx.description = description;
    tx.network = 'CELO';
    tx.stableCoin = StableToken.cUSD;

    const x = await sendFunds(StableToken.cUSD, sender, recipient, usdAmount);

    tx.blockchainTransactionHash = x.transactionHash;
    tx.blockchainTransactionIndex = x.transactionIndex;
    tx.transactionBlockHash = x.blockHash;
    tx.blockchainTransactionStatus = x.status;

    const r: Record<string, any> = tx;
    r.senderFeduid = sender.feduid;
    r.senderAddress = sender.publicAddress;
    r.recipientFeduid = recipient.feduid;
    r.transactionCode = '1123';
    r.transactionTimestamp = 1234567890;

    r.todaysTimestamp = 1234567890;
    r.timestamp = 1234567890;


    return await this.saveTransactionCypherQry(r);
  }

  /**
   * Saves the transaction details to the cypher query.
   * @param params the transaction data.
   * @returns the result of the transaction.
   */
  async saveTransactionCypherQry(params: Record<string, any>) {
    const transactionResult = await this.neo4j.write(
      'MATCH (sender: User) MATCH (recipient: User) ' +
      ' WHERE sender.feduid = $senderFeduid AND recipient.feduid = $recipientFeduid ' +
      ' MERGE (sender)-[:TRANSACTED_ON]->(senderDay: Day {timestamp: $todaysTimestamp}) MERGE' +
      ' (recipient)-[:TRANSACTED_ON]->(recipientDay: Day {timestamp: $todaysTimestamp}) ' +
      ' CREATE (senderDay)-[:RECORDED]->(transaction:Transaction { ' +
      '     description: $description, ' +
      '     transactionCode: $transactionCode, ' +
      '     amount: $amount, ' +
      '     stableCoin: $stableCoin, ' +
      '     network: $network, ' +
      '     blockchainTransactionHash: $blockchainTransactionHash, ' +
      '     blockchainTransactionIndex: $blockchainTransactionIndex, ' +
      '     transactionBlockHash: $transactionBlockHash, ' +
      '     blockchainTransactionStatus: $blockchainTransactionStatus, ' +
      '     transactionTimestamp: $transactionTimestamp, ' +
      '     senderAddress: $senderAddress, ' +
      '     timestamp: $timestamp' +
      ' })<-[:RECORDED]-(recipientDay) ' +
      ' return transaction, senderDay, recipientDay, sender, recipient',
      params,
    );

    return transactionResult;
  }
}
