import { Test, TestingModule } from '@nestjs/testing';
import { SendFundsService } from '../send-funds.service';
import { Neo4jModule, Neo4jService } from 'nest-neo4j/dist';
import { UsersModule } from '../../../users/users.module';
import assert from 'assert';
import {
  TEST_ACC_1,
  TEST_ACC_2,
} from '../../../../test/test-utils/test.accounts';
import { User } from '../../../datatypes/user/user';
import { initializeContractKit } from '../../../utils/block-chain-utils/contract.kit.utils';
import {
  Transaction,
  nodeToTransaction,
} from '../../../datatypes/transaction/transaction';
import { deleteUsers } from './test.utils';
import { DB_CONNECTIONS_CONFIGS } from '../../../db.config';

describe('SendFundsService: SEND FUNDS CYPHER QUERY : TEST SUIT', () => {
  let service: SendFundsService;
  let dbService: Neo4jService;
  let app: TestingModule;

  beforeAll(async () => {
    initializeContractKit();
    app = await Test.createTestingModule({
      providers: [SendFundsService],
      imports: [Neo4jModule.forRoot(DB_CONNECTIONS_CONFIGS), UsersModule],
    }).compile();

    service = app.get<SendFundsService>(SendFundsService);
    dbService = app.get<Neo4jService>(Neo4jService);
    await setUpTestUsers(dbService);
  });

  afterAll(async () => {
    await deleteUsers(dbService);
    await dbService.getDriver().close();
    await app.close();
  }, 7000);

  it('Send funds cypher query test.', async () => {
    const user1 = new User();
    user1.publicAddress = TEST_ACC_1.address;
    user1.privateKey = TEST_ACC_1.privateKey;
    user1.feduid = '1234567890';

    const user2 = new User();
    user2.publicAddress = TEST_ACC_2.address;
    user2.privateKey = TEST_ACC_1.privateKey;
    user2.feduid = '1234567891';

    const tx = await service.sendcUSD(
      0.0001,
      'Test Transaction',
      user1,
      user2,
      -1
    );
    expect(tx.records[0].get('transaction')).toBeDefined;
    expect(tx.records[0].get('senderDay')).toBeDefined;
    expect(tx.records[0].get('recipientDay')).toBeDefined;
    expect(tx.records[0].get('sender')).toBeDefined;
    expect(tx.records[0].get('recipient')).toBeDefined;

    expect(tx.records[0].get('senderDay').timestamp).toBe(
      tx.records[0].get('senderDay').timestamp
    );

    const savedTx: Transaction = nodeToTransaction(
      tx.records[0].get('transaction')
    );

    expect(savedTx.amount).toBe(0.0001);
    expect(savedTx.stableCoin).toBe('cUSD');
    expect(savedTx.network).toBe('CELO');
    expect(savedTx.senderAddress).toBe(user1.publicAddress);
    expect(savedTx.blockchainTransactionStatus).toBe(true);
  }, 12000);
});

async function setUpTestUsers(dbService: Neo4jService) {
  const qry = `CREATE (user1:User {feduid: $feduid1, publicAddress: $publicAddress1, privateKey: $privateKey1}), 
     (user2: User {feduid: $feduid2, publicAddress: $publicAddress2, privateKey: $privateKey2})RETURN user1, user2`;

  const rst = await dbService.write(qry, {
    feduid1: '1234567890',
    publicAddress1: TEST_ACC_1.address,
    privateKey1: TEST_ACC_1.privateKey,
    feduid2: '1234567891',
    publicAddress2: TEST_ACC_2.address,
    privateKey2: TEST_ACC_2.privateKey,
  });

  rst.records[0].get('user1');
  rst.records[0].get('user2');

  assert(rst.records[0].keys.length == 2, 'Id is valid.');
}
