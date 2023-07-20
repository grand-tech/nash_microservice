import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseAirtimeService } from '../purchase-airtime.service';
import { Neo4jModule } from 'nest-neo4j/dist';
import { DB_CONNECTIONS_CONFIGS } from '../../../../test/test-utils/test-utils.module';

describe('PurchaseAirtimeService', () => {
  let service: PurchaseAirtimeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PurchaseAirtimeService],
      imports: [Neo4jModule.forRoot(DB_CONNECTIONS_CONFIGS)],
    }).compile();

    service = module.get<PurchaseAirtimeService>(PurchaseAirtimeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
