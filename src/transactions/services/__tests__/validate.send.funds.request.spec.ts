import { TestingModule, Test } from '@nestjs/testing';
import { Neo4jService, Neo4jModule } from 'nest-neo4j/dist';
import { User, nodeToUser } from '../../../datatypes/user/user';
import { deleteNode } from '../../../../test/test-utils/test-utils.module';
import {
  TEST_ACC_1,
  TEST_ACC_2,
} from '../../../../test/test-utils/test.accounts';
import { SendFundsService } from '../send-funds.service';
import { UsersService } from '../../../users/users.service';
import { initializeContractKit } from '../../../utils/block-chain-utils/contract.kit.utils';
import { DB_CONNECTIONS_CONFIGS } from '../../../db.config';

describe('SendFundsService : SEND FUNDS VALIDATOR : TEST SUIT', () => {
  let service: SendFundsService;
  let dbService: Neo4jService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [SendFundsService, UsersService],
      imports: [Neo4jModule.forRoot(DB_CONNECTIONS_CONFIGS)],
    }).compile();

    service = module.get<SendFundsService>(SendFundsService);
    dbService = module.get<Neo4jService>(Neo4jService);
  });

  afterAll(async () => {
    dbService.getDriver().close();
    module.close();
  });

  it('Test Invalid Amount.', async () => {
    const response = await service.validateSendFunds(new User(), 0, '', '');

    expect(response.status).toBe(501);
    expect(response.message).toBe('Invalid amount should be greater 0.');
  });

  it('Test Invalid Phone Number.', async () => {
    const response = await service.validateSendFunds(new User(), 1, '', '');
    expect(response.status).toBe(502);
    expect(response.message).toBe('Invalid phone number.');
  });

  it('Test unregistered phone number.', async () => {
    const response = await service.validateSendFunds(
      new User(),
      1,
      '+25479231433',
      ''
    );
    expect(response.status).toBe(504);
    expect(response.message).toBe('Account with phone number does not exist.');
  });

  describe('Test Unregistered Phone Number.', () => {
    let sender: User;
    let receiver: User;
    const testPhoneNumber = '+254791725659';

    // clean up.
    beforeEach(async () => {
      initializeContractKit();
      const rst = await dbService.write(
        'CREATE (sender:User {name: "Test User", publicAddress: $senderAddress, privateKey: $privateKey, feduid: $senderFeduid}), ' +
          ' (receiver:User {name: "Test User", publicAddress: $receiverAddress,  phoneNumber: $phoneNumber, feduid: $receiverFeduid }) RETURN sender, receiver',
        {
          phoneNumber: testPhoneNumber,
          senderFeduid: TEST_ACC_1.address,
          privateKey: TEST_ACC_1.privateKey,
          senderAddress: TEST_ACC_1.address,
          receiverAddress: TEST_ACC_2.address,
          receiverFeduid: TEST_ACC_2.address,
        }
      );

      const usr = rst.records[0].get('sender');
      const r = rst.records[0].get('receiver');
      sender = nodeToUser(usr);
      receiver = nodeToUser(r);
    });

    afterEach(async () => {
      if (sender.id) {
        await deleteNode(sender.id, dbService);
      }

      if (receiver.id) {
        await deleteNode(receiver.id, dbService);
      }
    });

    it('Actual test case', async () => {
      const response = await service.validateSendFunds(
        sender,
        0.000001,
        testPhoneNumber,
        'School Fees'
      );
      expect(response.status).toBe(200);
      expect(response.message).toBe('Success');
      expect(response.body.amount).toBe(0.000001);
    }, 10000);
  });
});
