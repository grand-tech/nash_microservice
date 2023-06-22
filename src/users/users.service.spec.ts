import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Neo4jModule, Neo4jService } from 'nest-neo4j/dist';
import { User } from 'src/datatypes/user/user';
import {
  DB_CONNECTIONS_CONFIGS,
  deleteNode,
} from '../../test/test-utils/test-utils.module';

describe('UsersService', () => {
  let service: UsersService;
  let dbService: Neo4jService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
      imports: [Neo4jModule.forRoot(DB_CONNECTIONS_CONFIGS)],
    }).compile();

    service = module.get<UsersService>(UsersService);
    dbService = module.get<Neo4jService>(Neo4jService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Test User Creation Cypher Query', () => {
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
      };

      const usr = await service.createUser(user, 'Customer');

      expect(usr.email).toBe(user.email);
      expect(usr.name).toBe(user.name);
      expect(usr.phoneNumber).toBe(user.phoneNumber);
      expect(usr.feduid).toBe(user.feduid);
      expect(usr.idNumber).toBe(user.idNumber);
      expect(usr.publicAddress).toBe(user.publicAddress);
      expect(usr.id).toBeGreaterThan(0);
      expect(usr.labels).toContain('Customer');
      expect(usr.labels).toContain('User');

      if (usr.id) {
        const rst = await deleteNode(usr.id, dbService);
      }
    });
  });

  describe('Query User By Feduid', () => {
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
      };

      await service.createUser(user, 'Customer');
      const usr = await service.getUser(user.feduid);

      expect(usr.email).toBe(user.email);
      expect(usr.name).toBe(user.name);
      expect(usr.phoneNumber).toBe(user.phoneNumber);
      expect(usr.feduid).toBe(user.feduid);
      expect(usr.idNumber).toBe(user.idNumber);
      expect(usr.publicAddress).toBe(user.publicAddress);
      expect(usr.id).toBeGreaterThan(0);
      expect(usr.labels).toContain('Customer');
      expect(usr.labels).toContain('User');

      if (usr.id) {
        const rst = await deleteNode(usr.id, dbService);
      }
    });
  });
});
