import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { Neo4jModule, Neo4jService } from 'nest-neo4j/dist';
import { User, nodeToUser } from '../../datatypes/user/user';
import {
  DB_CONNECTIONS_CONFIGS,
  deleteNode,
} from '../../../test/test-utils/test-utils.module';
import { CryptoWalletCreatorService } from '../crypto-wallet-creator.service';

describe('UsersService', () => {
  let service: UsersService;
  let dbService: Neo4jService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [UsersService, CryptoWalletCreatorService],
      imports: [Neo4jModule.forRoot(DB_CONNECTIONS_CONFIGS)],
    }).compile();

    service = module.get<UsersService>(UsersService);
    dbService = module.get<Neo4jService>(Neo4jService);
  });

  afterAll(async () => {
    dbService.getDriver().close();
    module.close();
  });

  describe('KYC record tests', () => {
    let userID = -1;
    const feduid = Math.random().toString();

    beforeEach(async () => {
      const rst = await dbService.write(
        'CREATE (user:User ' +
        ' { email: $email, feduid: $feduid, phoneNumber: $phoneNumber}) RETURN user',
        {
          feduid: feduid,
          email: feduid,
          phoneNumber: feduid,
        },
      );

      const usr = rst.records[0].get('user');
      const user = nodeToUser(usr);

      userID = user.id;
    });

    // clean up.
    afterEach(async () => {
      if (userID) {
        await deleteNode(userID, dbService);
      }
    });

    it('Test phone number already exists.', async () => {
      const user: User = {
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        phoneNumber: '',
        feduid: '1234567890',
        idNumber: undefined,
        publicAddress: undefined,
        id: undefined,
        labels: [],
        privateKey: '',
        publicKey: '',
        mnemonic: '',
      };

      const rsp = await service.saveUserProfile(user, feduid, feduid);

      expect(rsp.status).toBe(500);
      expect(rsp.message).toBe(
        'Phone number already in use by another account.',
      );
    });

    it('Existing but same account.', async () => {
      const user: User = {
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        phoneNumber: '',
        feduid: feduid,
        idNumber: undefined,
        publicAddress: undefined,
        id: undefined,
        labels: [],
        privateKey: '',
        publicKey: '',
        mnemonic: '',
      };

      const rsp = await service.saveUserProfile(user, feduid, feduid);

      const usr: User = rsp.body;
      expect(rsp.status).toBe(200);
      expect(rsp.message).toBe('Success');

      expect(usr.phoneNumber).toBe(feduid);
      expect(usr.feduid).toBe(feduid);
      expect(usr.name).toBe(feduid);
    });

    it('Phone number does not exist in records.', async () => {
      const user: User = {
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        phoneNumber: '',
        feduid: feduid,
        idNumber: undefined,
        publicAddress: undefined,
        id: undefined,
        labels: [],
        privateKey: '',
        publicKey: '',
        mnemonic: '',
      };

      const rsp = await service.saveUserProfile(
        user,
        '+25421745952',
        'John Doe',
      );

      const usr: User = rsp.body;

      expect(rsp.status).toBe(200);
      expect(rsp.message).toBe('Success');

      expect(usr.phoneNumber).toBe('+25421745952');
      expect(usr.feduid).toBe(feduid);
      expect(usr.name).toBe('John Doe');
    });

    it('Query user by phone number.', async () => {
      const usr = await service.queryClientWithPhoneNumber(feduid);

      expect(usr.phoneNumber).toBe(feduid);
      expect(usr.feduid).toBe(feduid);
    });
  });
});
