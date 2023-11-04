import { StableToken } from '@celo/base';
import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { User } from '../../datatypes/user/user';
import { UsersService } from '../../users/users.service';
import { nodeToFundsRequest, FundsRequest } from '../../datatypes/transaction/funds.request';
import { FundsRequestResponse, TransactionResponse } from '../../utils/response';
import { SendFundsService } from './send-funds.service';
import { Transaction } from 'src/datatypes/transaction/transaction';

@Injectable()
export class RequestFundsService {
  constructor(
    private readonly neo4j: Neo4jService,
    private readonly userService: UsersService,
    private readonly sendFundsService: SendFundsService
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
  ): Promise<FundsRequestResponse> {
    const response: FundsRequestResponse = {
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
          const transaction = nodeToFundsRequest(tx.records[0].get('tx'));
          // Recipient does not exist.
          response.body = transaction;
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
    const tx: FundsRequest = new FundsRequest();

    tx.amount = usdAmount;
    tx.description = description;
    tx.network = 'CELO';
    tx.stableCoin = StableToken.cUSD;


    const r: Record<string, any> = tx;
    r.initiatorFeduid = initiator.feduid;
    r.initiatorAddress = initiator.publicAddress;
    r.targetFeduid = target.feduid;
    r.targetAddress = target.publicAddress;
    r.todaysTimestamp = 1234567890;
    r.timestamp = 1234567890;

    const fundsRequest = await this.neo4j.write(
      'MATCH (initiator: User) MATCH (target: User) ' +
      ' WHERE initiator.feduid = $initiatorFeduid AND target.feduid = $targetFeduid ' +
      ' MERGE (initiator)-[:REQUESTED_FUNDS_ON]->(initiatorDay: Day {timestamp: $todaysTimestamp}) ' +
      ' MERGE (target)-[:REQUESTED_FUNDS_ON]->(targetDay: Day {timestamp: $todaysTimestamp}) ' +
      ' CREATE (initiatorDay)-[:RECORDED]->(tx:FundsRequest { ' +
      '     description: $description, ' +
      '     amount: $amount, ' +
      '     stableCoin: $stableCoin, ' +
      '     network: $network, ' +
      '     initiatorAddress: $initiatorAddress, ' +
      '     targetAddress: $targetAddress, ' +
      '     timestamp: $timestamp,' +
      '     fulfilled: false' +
      ' })<-[:RECORDED]-(targetDay) ' +
      ' return tx, initiatorDay, targetDay, initiator, target',
      tx,
    );

    return fundsRequest;
  }

  /**
   * Fullfil funds request.
   * @param requestID the request id.
   * @param target the target of the transaction request(user in session).
   * Returns transaction object.
   */
  async fulfillFundsRequest(target: User, requestID: number): Promise<TransactionResponse> {
    const fundsRequest: FundsRequest = await this.queryFundsRequestByIDAndTarget(target, requestID);

    let transactionResponse: TransactionResponse;
    if (fundsRequest) {
      const transactionResult = await this.sendFundsService.validateSendFunds(fundsRequest.target,
        fundsRequest.amount,
        fundsRequest.initiator.phoneNumber,
        fundsRequest.description
      )

      transactionResponse = transactionResult;
      await this.updateFulfilledFundsRequest(fundsRequest, transactionResult.body as Transaction)
    } else {
      transactionResponse = {
        status: 501,
        message: 'Could not find funds request!!',
        body: undefined
      }
    }

    return transactionResponse;
  }

  /**
   * Query fulfilled funds request.
   * @param fundsRequest funds request object.
   * @param transactionResult transaction result object.
   */
  async updateFulfilledFundsRequest(
    fundsRequest: FundsRequest,
    transaction: Transaction
  ): Promise<FundsRequest> {
    const qry = ' MATCH (fundsRequest: FundsRequest), (transaction: Transaction) ' +
      ' WHERE id(fundsRequest) = $fundsRequestID AND id(transaction) = $transactionID ' +
      ' CREATE (transaction)-[:FULFILLED_FUND_REQUEST]->(fundsRequest) ' +
      ' SET fundsRequest.fulfilled RETURN fundsRequest, transaction '

    const params = {
      fundsRequestID: fundsRequest.id,
      transactionID: transaction.id
    }

    const request = await this.neo4j.write(qry, params);
    return nodeToFundsRequest(request.records[0].get('fundsRequest'));
  }

  /**
   * Queries details pertaining to the transaction request.
   * @param target the target of the transaction request.
   * @param requestID the request id.
   * @returns the details of the funds request.
   */
  async queryFundsRequestByIDAndTarget(target: User, requestID: number): Promise<FundsRequest> {

    const qry = 'MATCH (initiator: User)-[:REQUESTED_FUNDS_ON]->(:Day)-[:RECORDED]->' +
      '(fundsRequest: FundsRequest)<-[:RECORDED]-(:Day)<-[:REQUESTED_FUNDS_ON]-(target: User) ' +
      ' WHERE fundsRequest.id = $requestID, fundsRequest.targetAddress = $targetAddress, ' +
      ' target.publicAddress = $targetAddress RETURN fundsRequest, initiator, target'

    const params = {
      requestID: requestID,
      targetAddress: target.publicAddress,
    }

    const data = await this.neo4j.read(qry, params);

    const fundsRequest: FundsRequest =
      data.records[0].get('fundsRequest');

    fundsRequest.target = data.records[0].get('target');
    fundsRequest.initiator = data.records[0].get('initiator');

    return fundsRequest;
  }
}
