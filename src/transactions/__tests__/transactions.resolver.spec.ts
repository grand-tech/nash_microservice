import request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { FirebaseTestUtilsService } from '../../../test/test-utils/firebase-test-utils/firebase-test-utils.service';
import { Neo4jService } from 'nest-neo4j/dist';
import { addTestUser } from '../../../test/test-utils/test-utils.module';
import { SendFundsService } from '../services/send-funds.service';

// User service mock.
const sendFundsServiceMock = {
  validateSendFunds: () => {
    return {
      status: 200,
      message: 'Success',
      body: {
        labels: ['Transaction'],
        id: 1171,
        description: 'School Fees',
        transactionCode: '1123',
        amount: 0.000001,
        stableCoin: 'cUSD',
        network: 'CELO',
        blockchainTransactionHash:
          '0xfecc30488e9837e427ac7a40774ca9442cb3a37f4553947f7026eebf57552a12',
        blockchainTransactionIndex: 0,
        transactionBlockHash:
          '0x30d7c4b5aca4b321435c8a9cb65d1f1732d2bd8181d46759e5adad8124ef4d3e',
        blockchainTransactionStatus: true,
        transactionTimestamp: 1234567890,
        senderAddress: '0xFf1A74330dd9e899E5a857E251F8880554F6A260',
      },
    };
  },
};

describe('TRANSACTION RESOLVER : SEND FUNDS SERVICE MUTATION : SUIT ', () => {
  let testUtils: FirebaseTestUtilsService;
  let app: NestFastifyApplication;
  let db: Neo4jService;
  let skey: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [FirebaseTestUtilsService],
    })
      .overrideProvider(SendFundsService)
      .useValue(sendFundsServiceMock)
      .compile();

    app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );
    await app.init();
    await app.getHttpAdapter().getInstance().ready();

    testUtils = moduleRef.get<FirebaseTestUtilsService>(
      FirebaseTestUtilsService,
    );
    db = moduleRef.get<Neo4jService>(Neo4jService);

    // Get skey;
    const user = await testUtils.auth('test@gmail.com', 'test123');
    await addTestUser(user.feduid, db);
    skey = user.skey;
  }, 7000);

  afterAll(async () => {
    await app.close();
  });

  it(`Check if create new crypto wallet mutation exists.`, () => {
    const mutation = `mutation {
      sendUsd(recipientPhoneNumber: "+254791235651", usdAmount: 0.00001, description: "Describe") {
        status
        message
        body {
          amount
          description
          blockchainTransactionHash
          blockchainTransactionIndex
          stableCoin
        }
      }
    }`;

    return request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', skey)
      .send({
        query: mutation,
      })
      .expect(200)
      .expect((res) => {
        const rsp = res.body.data.sendUsd;
        expect(rsp.status).toBe(200);
        expect(rsp.message).toBe('Success');

        const body = rsp.body;
        expect(body.amount).toBe(0.000001);
      });
  }, 6000);
});
