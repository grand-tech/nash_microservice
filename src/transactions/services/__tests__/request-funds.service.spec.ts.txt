import { Test, TestingModule } from '@nestjs/testing';
import { RequestFundsService } from '../request-funds.service';
import { Neo4jModule, Neo4jService } from 'nest-neo4j/dist';
import { DB_CONNECTIONS_CONFIGS } from '../../../../test/test-utils/test-utils.module';
import { UsersModule } from '../../../users/users.module';

describe('RequestFundsService', () => {
  let service: RequestFundsService;
  let dbService: Neo4jService;
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [RequestFundsService],
      imports: [Neo4jModule.forRoot(DB_CONNECTIONS_CONFIGS), UsersModule],
    }).compile();

    service = app.get<RequestFundsService>(RequestFundsService);
    dbService = app.get<Neo4jService>(Neo4jService);
  });

  afterAll(() => {
    dbService.getDriver().close();
    app.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
