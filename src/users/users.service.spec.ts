import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Neo4jModule, Neo4jService } from 'nest-neo4j/dist';
import { User, nodeToUser } from '../datatypes/user/user';
import {
  DB_CONNECTIONS_CONFIGS,
  deleteNode,
} from '../../test/test-utils/test-utils.module';
import { CryptoWalletCreatorService } from './crypto-wallet-creator/crypto-wallet-creator.service';

describe('UsersService', () => {
  let service: UsersService;
  let dbService: Neo4jService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, CryptoWalletCreatorService],
      imports: [Neo4jModule.forRoot(DB_CONNECTIONS_CONFIGS)],
    }).compile();

    service = module.get<UsersService>(UsersService);
    dbService = module.get<Neo4jService>(Neo4jService);
  });

  afterAll(async () => {
    dbService.getDriver().close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Test User Creation Cypher Query', () => {
    let userID: Number;
    // clean up.
    afterEach(async () => {
      if (userID) {
        const rst = await deleteNode(userID, dbService);
      }
    });

    it('Creation data should be saved properly.', async () => {
      const user: User = {
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        phoneNumber: '+254791725651',
        feduid: '1234567890',
        idNumber: undefined,
        publicAddress: undefined,
        id: undefined,
        labels: [],
        privateKey: '',
        publicKey: '',
        mnemonic: '',
      };

      const usr = await service.createUser(user, 'Customer');
      userID = usr.id;

      expect(usr.email).toBe(user.email);

      expect(usr.feduid).toBe(user.feduid);
      expect(usr.idNumber).toBe(user.idNumber);
      expect(usr.publicAddress).toBe(user.publicAddress);
      expect(usr.id).toBeGreaterThan(0);
      expect(usr.labels).toContain('Customer');
      expect(usr.labels).toContain('User');
    });
  });

  describe('Query User By Feduid', () => {
    let userID: Number;

    // clean up.
    afterEach(async () => {
      if (userID) {
        const rst = await deleteNode(userID, dbService);
      }
    });

    it('Should have one record.', async () => {
      const user: User = {
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        phoneNumber: '+254791725651',
        feduid: '1234567890',
        idNumber: undefined,
        publicAddress: undefined,
        id: undefined,
        labels: [],
        privateKey: '',
        publicKey: '',
        mnemonic: '',
      };

      await service.createUser(user, 'Customer');
      const usr = await service.getUser(user.feduid);
      userID = usr.id;

      expect(usr.email).toBe(user.email);
      expect(usr.feduid).toBe(user.feduid);
      expect(usr.idNumber).toBe(user.idNumber);
      expect(usr.publicAddress).toBe(user.publicAddress);
      expect(usr.id).toBeGreaterThan(-1);
      expect(usr.labels).toContain('Customer');
      expect(usr.labels).toContain('User');
    });
  });

  describe('Validate new user information.', () => {
    let userID: Number;

    // clean up.
    afterEach(async () => {
      if (userID) {
        const rst = await deleteNode(userID, dbService);
      }
    });

    it('Should throw invalid session key.', async () => {
      const user: User = {
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        phoneNumber: '+254791725651',
        feduid: '',
        idNumber: undefined,
        publicAddress: undefined,
        id: undefined,
        labels: [],
        privateKey: '',
        publicKey: '',
        mnemonic: '',
      };

      const rsp = await service.validateNewUser(user);

      expect(rsp.status).toBe(500);
      expect(rsp.message).toBe('Invalid session key!!');
    });

    it('Successfuly create new account', async () => {
      const user: User = {
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        phoneNumber: '+254791725651',
        feduid: '123456',
        idNumber: undefined,
        publicAddress: undefined,
        id: undefined,
        labels: [],
        privateKey: '',
        publicKey: '',
        mnemonic: '',
      };

      const rsp = await service.validateNewUser(user);

      const usr = rsp.body as User;
      userID = usr.id;

      expect(rsp.status).toBe(200);
      expect(rsp.message).toBe('Success');

      expect(usr.email).toBe(user.email);
      expect(usr.feduid).toBe(user.feduid);
      expect(usr.idNumber).toBe(user.idNumber);
      expect(usr.publicAddress).toBe(user.publicAddress);
      expect(usr.id).toBeGreaterThan(0);
      expect(usr.labels).toContain('Customer');
      expect(usr.labels).toContain('User');
    });
  });

  describe('Test User Save Crypto Wallet Cypher Query.', () => {
    let userID: Number;
    let feduid = Math.random().toString();
    // after each
    beforeEach(async () => {
      const rst = await dbService.write(
        'CREATE (user:User ' +
          ' { email: $email, feduid: $feduid}) RETURN user',
        {
          feduid: feduid,
          email: feduid,
        },
      );

      const usr = rst.records[0].get('user');
      const user = nodeToUser(usr);

      userID = user.id;
    });

    // clean up.
    afterEach(async () => {
      if (userID) {
        const rst = await deleteNode(userID, dbService);
      }
    });

    it('Successfuly save crypto wallet information', async () => {
      const user: User = {
        privateKey: 'privateKey',
        publicKey: 'publicKey',
        publicAddress: 'publicAddress',
        mnemonic: 'mnemonic',
        name: '',
        feduid: feduid,
        email: '',
        phoneNumber: '',
        idNumber: '',
        id: undefined,
        labels: [],
      };

      const savedUser = await service.saveCryptoWalletDetails(user);

      expect(savedUser.privateKey).toBe('privateKey');
      expect(savedUser.publicAddress).toBe('publicAddress');
      expect(savedUser.publicKey).toBe('publicKey');
      expect(savedUser.mnemonic).toBe('mnemonic');

      expect(savedUser.feduid).toBe(feduid);
      expect(savedUser.email).toBe(feduid);
    });
  });

  describe('Test User Create Crypto Wallet Method.', () => {
    let userID: Number;
    let feduid = Math.random().toString();
    // after each
    beforeEach(async () => {
      const rst = await dbService.write(
        'CREATE (user:User ' +
          ' { email: $email, feduid: $feduid}) RETURN user',
        {
          feduid: feduid,
          email: feduid,
        },
      );

      const usr = rst.records[0].get('user');
      const user = nodeToUser(usr);

      userID = user.id;
    });

    // clean up.
    afterEach(async () => {
      if (userID) {
        const rst = await deleteNode(userID, dbService);
      }
    });

    it('Successfuly save crypto wallet information', async () => {
      const user: User = {
        name: '',
        feduid: feduid,
        email: '',
        phoneNumber: '',
        idNumber: '',
        id: undefined,
        labels: [],
        publicAddress: '',
        privateKey: '',
        publicKey: '',
        mnemonic: '',
      };

      const savedUser = await service.createCryptoAccount(user);

      expect(savedUser.privateKey).not.toEqual('');
      expect(savedUser.publicAddress).not.toEqual('');
      expect(savedUser.publicKey).not.toEqual('');
      expect(savedUser.mnemonic).not.toEqual('');
      expect(savedUser.mnemonic).toContain(' ');

      expect(savedUser.feduid).toBe(feduid);
      expect(savedUser.email).toBe(feduid);
    });

    it('Test with already created account', async () => {
      const user: User = {
        name: '',
        feduid: feduid,
        email: '',
        phoneNumber: '',
        idNumber: '',
        id: undefined,
        labels: [],
        publicAddress: 'publicAddress',
        privateKey: 'privateKey',
        publicKey: 'publicKey',
        mnemonic: 'mnemonic',
      };

      const savedUser = await service.createCryptoAccount(user);

      expect(savedUser.privateKey).toBe('privateKey');
      expect(savedUser.publicAddress).toBe('publicAddress');
      expect(savedUser.publicKey).toBe('publicKey');
      expect(savedUser.mnemonic).toBe('mnemonic');

      expect(savedUser.feduid).toBe(feduid);
      expect(savedUser.email).toEqual('');
    });
  });
});
