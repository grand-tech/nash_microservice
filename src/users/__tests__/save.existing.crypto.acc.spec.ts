import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { Neo4jModule, Neo4jService } from 'nest-neo4j/dist';
import { User, nodeToUser } from '../../datatypes/user/user';
import { deleteNode } from '../../../test/test-utils/test-utils.module';
import {
  AccountInformation,
  CryptoWalletCreatorService,
} from '../crypto-wallet-creator.service';
import { TEST_ACC_3 } from '../../../test/test-utils/test.accounts';
import {
  dismantleContractKit,
  initializeContractKit,
} from '../../utils/block-chain-utils/contract.kit.utils';
import { DB_CONNECTIONS_CONFIGS } from '../../db.config';

describe('UsersService', () => {
  let service: UsersService;
  let dbService: Neo4jService;
  let module: TestingModule;

  beforeAll(async () => {
    initializeContractKit();
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
    dismantleContractKit();
  });

  describe('Test Validate Existing Crypto Account.', () => {
    let userID = -1;
    const feduid = Math.random().toString();
    let existingUID: number;

    beforeEach(async () => {
      const rst = await dbService.write(
        'CREATE (user:User ' +
          ' { email: $email, feduid: $feduid}) RETURN user',
        {
          feduid: feduid,
          email: feduid,
        }
      );

      const usr = rst.records[0].get('user');
      const user = nodeToUser(usr);

      userID = user.id;
    });

    // clean up.
    afterEach(async () => {
      if (userID > -1) {
        await deleteNode(userID, dbService);
      }

      if (existingUID) {
        await deleteNode(existingUID, dbService);
      }
    });

    it('Test Invalid Private Key', async () => {
      const account: AccountInformation = {
        mnemonic: '',
        privateKey: '',
        publicKey: '',
        address: '',
      };

      const rsp = await service.validateExistingCryptoAccount(feduid, account);

      expect(rsp.status).toBe(502);
      expect(rsp.message).toBe(
        'Invalid private key or mnemonic(seed phrase)!!'
      );
    });

    it('Save Valid Account Details.', async () => {
      const account: AccountInformation = TEST_ACC_3;

      const rsp = await service.validateExistingCryptoAccount(feduid, account);

      expect(rsp.status).toBe(200);
      expect(rsp.message).toBe('Success');

      expect(rsp.body.privateKey).toBe(TEST_ACC_3.privateKey);
      expect(rsp.body.publicAddress).toBe(TEST_ACC_3.address);
      expect(rsp.body.publicKey).toBe(TEST_ACC_3.publicKey);
      expect(rsp.body.mnemonic).toBe(TEST_ACC_3.mnemonic);
      expect(rsp.body.feduid).toBe(feduid);
    });

    it('Already existing public address.', async () => {
      const account: AccountInformation = TEST_ACC_3;

      const existingUser = await dbService.write(
        'MATCH (user:User { feduid: $feduid}) ' +
          ' SET user.publicAddress = $publicAddress RETURN user',
        {
          feduid: feduid,
          publicAddress: TEST_ACC_3.address,
        }
      );

      existingUID = nodeToUser(existingUser.records[0].get('user')).id;
      const rsp = await service.validateExistingCryptoAccount(feduid, account);

      expect(rsp.status).toBe(503);
      expect(rsp.message).toBe(
        'Private key is already in use by another account!!'
      );
    });
  });

  describe('composeAddWeb3AccQryParams', () => {
    it('Test empty public key and mnemonic', () => {
      const user = new User();

      const acc: AccountInformation = {
        privateKey: 'privateKey',
        address: 'address',
        publicKey: undefined,
        mnemonic: undefined,
      };

      service.composeAddWeb3AccQryParams(user, acc);

      expect(user.privateKey).toBe('privateKey');
      expect(user.publicAddress).toBe('address');
      expect(user.publicKey).toBe('');
      expect(user.mnemonic).toBe('');
    });

    it('Test valid public key and mnemonic', () => {
      const user = new User();

      service.composeAddWeb3AccQryParams(user, TEST_ACC_3);

      expect(user.privateKey).toBe(TEST_ACC_3.privateKey);
      expect(user.publicAddress).toBe(TEST_ACC_3.address);
      expect(user.publicKey).toBe(TEST_ACC_3.publicKey);
      expect(user.mnemonic).toBe(TEST_ACC_3.mnemonic);
    });
  });

  describe('addMnemonicToAccount', () => {
    const feduid = Math.random().toString();

    it('Test user with private key', async () => {
      const user = new User();

      user.privateKey = feduid;

      const rsp = await service.addMnemonicToAccount(user, '');

      expect(rsp.status).toBe(501);
    });

    it('Test user without private key', async () => {
      const user = new User();
      user.feduid = feduid;

      const rsp = await service.addMnemonicToAccount(user, TEST_ACC_3.mnemonic);
      expect(rsp.status).toBe(504);
    });
  });

  describe('addPrivateKeyToAccount', () => {
    const feduid = Math.random().toString();

    it('Test user with private key', async () => {
      const user = new User();

      user.privateKey = feduid;

      const rsp = await service.addPrivateKeyToAccount(user, '');

      expect(rsp.status).toBe(501);
    });

    it('Test user without private key', async () => {
      const user = new User();
      user.feduid = feduid;

      const rsp = await service.addPrivateKeyToAccount(
        user,
        TEST_ACC_3.privateKey
      );
      expect(rsp.status).toBe(504);
    });
  });
});
