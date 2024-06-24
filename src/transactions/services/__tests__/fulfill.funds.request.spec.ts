import { Test, TestingModule } from '@nestjs/testing';
import { Neo4jModule, Neo4jService } from 'nest-neo4j/dist';
import { UsersModule } from '../../../users/users.module';
import assert from 'assert';
import {
  TEST_ACC_1,
  TEST_ACC_2,
} from '../../../../test/test-utils/test.accounts';
import { initializeContractKit } from '../../../utils/block-chain-utils/contract.kit.utils';
import { RequestFundsService } from '../request-funds.service';
import { SendFundsService } from '../send-funds.service';
import { nodeToFundsRequest } from '../../../datatypes/transaction/funds.request';
import { User } from '../../../datatypes/user/user';
import { deleteUsers } from './test.utils';
import { DB_CONNECTIONS_CONFIGS } from '../../../db.config';

const inititatorFeduid = '1234567890';
const targetFeduid = '1234567891';

describe('RequestFundsService : FULFILL TRANSACTION VALIDATOR : TEST SUIT', () => {
  let service: RequestFundsService;
  let dbService: Neo4jService;
  let app: TestingModule;
  let testFundRequestID: number;

  beforeAll(async () => {
    initializeContractKit();
    app = await Test.createTestingModule({
      providers: [RequestFundsService, SendFundsService],
      imports: [Neo4jModule.forRoot(DB_CONNECTIONS_CONFIGS), UsersModule],
    }).compile();

    service = app.get<RequestFundsService>(RequestFundsService);
    dbService = app.get<Neo4jService>(Neo4jService);
  });

  beforeEach(async () => {
    await setUpTestUsers(dbService);
    testFundRequestID = await setUpTestTransactionRequest(service);
  }, 7000);

  afterEach(async () => {
    await deleteUsers(dbService);
  });

  afterAll(async () => {
    await dbService.getDriver().close();
    await app.close();
  }, 9000);

  it('Test invalid request id', async () => {
    const t = new User();
    t.publicAddress = TEST_ACC_2.address;
    const response = await service.fulfillFundsRequest(t, 1);

    expect(response.status).toBe(503);
    expect(response.message).toBe('Could not find funds request!!');
  }, 9000);

  it('Test already fulfilled request.', async () => {
    const t = new User();
    t.publicAddress = TEST_ACC_2.address;

    // Mark request id as fulfilled
    const qry = `MATCH (request:FundsRequest) WHERE id(request) = $requestID
                SET request.fulfilled = true RETURN request`;
    await dbService.write(qry, {
      requestID: testFundRequestID,
    });

    // run test against database record.
    const response = await service.fulfillFundsRequest(t, testFundRequestID);

    expect(response.status).toBe(501);
    expect(response.message).toBe('Transaction request already fulfilled!!');
  });

  it('Test successful request fulfillment.', async () => {
    const t = new User();
    t.publicAddress = TEST_ACC_2.address;
    const response = await service.fulfillFundsRequest(t, testFundRequestID);

    expect(response.status).toBe(200);
    expect(response.message).toBe('Success');
  }, 15000);
});

async function setUpTestUsers(dbService: Neo4jService) {
  const qry = `CREATE (user1:User {
        feduid: $feduid1,
         publicAddress: $publicAddress1,
         privateKey: $privateKey1,
         phoneNumber: $phoneNumber1
        }), 
        (user2: User {
            feduid: $feduid2, 
            publicAddress: $publicAddress2, 
            privateKey: $privateKey2,
            phoneNumber: $phoneNumber2
        })RETURN user1, user2`;

  const rst = await dbService.write(qry, {
    feduid1: inititatorFeduid,
    publicAddress1: TEST_ACC_1.address,
    privateKey1: TEST_ACC_1.privateKey,
    phoneNumber1: '+254791725651',
    feduid2: targetFeduid,
    publicAddress2: TEST_ACC_2.address,
    privateKey2: TEST_ACC_2.privateKey,
    phoneNumber2: '+254791725652',
  });

  rst.records[0].get('user1');
  rst.records[0].get('user2');

  assert(rst.records[0].keys.length == 2, 'Id is valid.');
}

async function setUpTestTransactionRequest(service: RequestFundsService) {
  const tx = await service.requestFundsCypherQry(
    0.01,
    '',
    {
      feduid: inititatorFeduid,
      publicAddress: TEST_ACC_1.address,
      name: '',
      email: '',
      phoneNumber: '',
      idNumber: '',
      privateKey: '',
      publicKey: '',
      id: 0,
      labels: [],
    },
    {
      feduid: targetFeduid,
      publicAddress: TEST_ACC_2.address,
      name: '',
      email: '',
      phoneNumber: '',
      idNumber: '',
      privateKey: '',
      publicKey: '',
      id: 0,
      labels: [],
    }
  );

  return nodeToFundsRequest(tx.records[0].get('request')).id;
}
