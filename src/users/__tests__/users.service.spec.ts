import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { Neo4jModule, Neo4jService } from 'nest-neo4j/dist';
import { User, nodeToUser } from '../../datatypes/user/user';
import { deleteNode } from '../../../test/test-utils/test-utils.module';
import { DB_CONNECTIONS_CONFIGS } from '../../db.config';
import { initializeContractKit } from '../../utils/block-chain-utils/contract.kit.utils';

describe('UsersService', () => {
  let service: UsersService;
  let dbService: Neo4jService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [UsersService],
      imports: [Neo4jModule.forRoot(DB_CONNECTIONS_CONFIGS)],
    }).compile();

    service = module.get<UsersService>(UsersService);
    dbService = module.get<Neo4jService>(Neo4jService);
  });

  afterAll(async () => {
    dbService.getDriver().close();
    module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Test User Creation Cypher Query', () => {
    let userID: number;
    // clean up.
    afterEach(async () => {
      if (userID) {
        await deleteNode(userID, dbService);
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
      };

      const usr = await service.createUserQuery(user);
      userID = usr.id;

      expect(usr.feduid).toBe(user.feduid);
      expect(usr.idNumber).toBe(user.idNumber);
      expect(usr.publicAddress).toBe(user.publicAddress);
      expect(usr.id).toBeGreaterThan(-1);
      expect(usr.labels).toContain('User');
    });
  });

  describe('Query User By Feduid', () => {
    let userID: number;

    // clean up.
    afterEach(async () => {
      if (userID) {
        await deleteNode(userID, dbService);
      }
    });

    it('Should have one record.', async () => {
      const user: User = {
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        phoneNumber: '+254791725651',
        feduid: '123456789-fetch-user-by-feduid',
        idNumber: undefined,
        publicAddress: undefined,
        id: undefined,
        labels: [],
        privateKey: '',
        publicKey: '',
      };

      await service.createUserQuery(user);
      const usr = await service.getUser(user.feduid);
      userID = usr.id;

      expect(usr.feduid).toBe(user.feduid);
      expect(usr.idNumber).toBe(user.idNumber);
      expect(usr.publicAddress).toBe(user.publicAddress);
      expect(usr.id).toBeGreaterThan(-1);
      expect(usr.labels).toContain('User');
    });
  });

  describe('Validate new user information.', () => {
    let userID: number;

    // clean up.
    afterEach(async () => {
      if (userID) {
        await deleteNode(userID, dbService);
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
      };

      const rsp = await service.validateNewUser(user);

      const usr = rsp.body as User;
      userID = usr.id;

      expect(rsp.status).toBe(200);
      expect(rsp.message).toBe('Success');

      expect(usr.feduid).toBe(user.feduid);
      expect(usr.idNumber).toBe(user.idNumber);
      expect(usr.publicAddress).toBe(user.publicAddress);
      expect(usr.id).toBeGreaterThan(-1);
      expect(usr.labels).toContain('User');
    });
  });

  describe('Test User Save Crypto Wallet Cypher Query.', () => {
    let userID: number;
    const feduid = Math.random().toString();
    // after each
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
      if (userID) {
        await deleteNode(userID, dbService);
      }
    });

    it('Successfuly save crypto wallet information', async () => {
      const user: User = {
        privateKey: 'privateKey',
        publicKey: 'publicKey',
        publicAddress: 'publicAddress',
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

      expect(savedUser.feduid).toBe(feduid);
      expect(savedUser.email).toBe(feduid);
    });
  });

  describe('Test User Create Crypto Wallet Method.', () => {
    let userID = -1;
    const feduid = Math.random().toString();
    // after each
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
    });

    it('Successfuly save crypto wallet information', async () => {
      initializeContractKit();
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
      };

      const rsp = await service.createCryptoAccount(user);
      expect(rsp.status).toEqual(200);
      expect(rsp.message).toEqual('Success');

      const savedUser = rsp.body;

      expect(savedUser.privateKey).not.toEqual('');
      expect(savedUser.publicAddress).not.toEqual('');
      // expect(savedUser.publicKey).not.toEqual('');

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
      };

      const rsp = await service.createCryptoAccount(user);

      expect(rsp.status).toEqual(200);
      expect(rsp.message).toEqual('Success');

      const savedUser = rsp.body;

      expect(savedUser.privateKey).toBe('privateKey');
      expect(savedUser.publicAddress).toBe('publicAddress');
      expect(savedUser.publicKey).toBe('publicKey');

      expect(savedUser.feduid).toBe(feduid);
      expect(savedUser.email).toEqual('');
    });
  });

  describe('getUserByPublicAddress', () => {
    let userID: number;

    const address = Math.random().toString();

    beforeEach(async () => {
      const rst = await dbService.write(
        'CREATE (user:User { publicAddress: $address, feduid: $feduid}) RETURN user',
        {
          feduid: address,
          address: address,
        }
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

    it('Should have one record.', async () => {
      const usr = await service.getUserByPublicAddress(address);
      userID = usr.id;

      expect(usr.feduid).toBe(address);
      expect(usr.publicAddress).toBe(address);
    });
  });
});
