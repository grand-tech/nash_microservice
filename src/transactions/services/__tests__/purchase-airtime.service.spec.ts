import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseAirtimeService } from '../purchase-airtime.service';
import { Neo4jModule, Neo4jService } from 'nest-neo4j/dist';
import { DB_CONNECTIONS_CONFIGS } from '../../../../test/test-utils/test-utils.module';
import { UsersModule } from '../../../users/users.module';

describe('PurchaseAirtimeService', () => {
  let service: PurchaseAirtimeService;
  let app: TestingModule;
  let dbService: Neo4jService;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [PurchaseAirtimeService],
      imports: [Neo4jModule.forRoot(DB_CONNECTIONS_CONFIGS), UsersModule],
    }).compile();

    service = app.get<PurchaseAirtimeService>(PurchaseAirtimeService);
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
