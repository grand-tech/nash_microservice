import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { UsersService } from '../../users/users.service';
import { User } from '../../datatypes/user/user';
import { sendFunds } from '../../utils/block-chain-utils/contract.kit.utils';
import { StableToken } from '@celo/base';
import { Transaction } from '../../datatypes/transaction/transaction';

@Injectable()
export class SendFundsService {
  constructor(
    private readonly neo4j: Neo4jService,
    private readonly userService: UsersService,
  ) { }

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
    recipient: User
  ) {
    const tx: Transaction = new Transaction()

    tx.amount = usdAmount
    tx.description = description
    tx.network = 'CELO'
    tx.stableCoin = StableToken.cUSD

    const x = await sendFunds(StableToken.cUSD, sender, recipient, usdAmount);

    tx.blockchainTransactionHash = x.transactionHash
    tx.blockchainTransactionIndex = x.transactionIndex
    tx.transactionBlockHash = x.blockHash
    tx.blockchainTransactionStatus = x.status

    const r: Record<string, any> = tx
    r.senderFeduid = sender.feduid
    r.senderAddress = sender.publicAddress
    r.recipientFeduid = recipient.feduid
    r.transactionCode = '1123'
    r.transactionTimestamp = 1234567890


    r.todaysTimestamp = 1234567890
    r.timestamp = 1234567890

    const transactionResult = await this.neo4j.write('MATCH (sender: User) MATCH (recipient: User) ' +
      ' WHERE sender.feduid = $senderFeduid AND recipient.feduid = $recipientFeduid ' +
      ' MERGE (sender)-[:TRANSACTED_ON]->(senderDay: Day {timestamp: $todaysTimestamp}) MERGE' +
      ' (recipient)-[:TRANSACTED_ON]->(receipientDay: Day {timestamp: $todaysTimestamp}) ' +
      ' CREATE (senderDay)-[:RECORDED]->(tx:Transaction { ' +
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
      ' })<-[:RECORDED]-(receipientDay) ' +
      ' return tx, senderDay, receipientDay, sender, recipient'
      , tx);

    return transactionResult;
  }
}
