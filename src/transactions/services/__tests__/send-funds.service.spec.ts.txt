import { Test, TestingModule } from '@nestjs/testing';
import { SendFundsService } from '../send-funds.service';
import { DB_CONNECTIONS_CONFIGS } from '../../../../test/test-utils/test-utils.module';
import { Neo4jModule, Neo4jService } from 'nest-neo4j/dist';
import { UsersModule } from '../../../users/users.module';

describe('SendFundsService', () => {
  let service: SendFundsService;
  let dbService: Neo4jService;
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [SendFundsService],
      imports: [Neo4jModule.forRoot(DB_CONNECTIONS_CONFIGS), UsersModule],
    }).compile();

    service = app.get<SendFundsService>(SendFundsService);
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
