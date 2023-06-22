import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Neo4jModule, Neo4jService } from 'nest-neo4j/dist';
import { User } from 'src/datatypes/user/user';
import { DB_CONNECTIONS_CONFIGS } from '../../test/test-utils/test-utils.module';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
      imports: [Neo4jModule.forRoot(DB_CONNECTIONS_CONFIGS)],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Test User Creation Cypher Query', () => {
    let service: UsersService;
    let dbService: Neo4jService;

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [UsersService],
        imports: [Neo4jModule.forRoot(DB_CONNECTIONS_CONFIGS)],
      }).compile();

      service = module.get<UsersService>(UsersService);
      dbService = module.get<Neo4jService>(Neo4jService);
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
    });
  });
});
