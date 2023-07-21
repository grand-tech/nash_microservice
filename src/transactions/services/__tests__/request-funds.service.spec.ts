import { Test, TestingModule } from '@nestjs/testing';
import { RequestFundsService } from '../request-funds.service';
import { Neo4jModule } from 'nest-neo4j/dist';
import { DB_CONNECTIONS_CONFIGS } from '../../../../test/test-utils/test-utils.module';
import { UsersModule } from '../../../users/users.module';

describe('RequestFundsService', () => {
  let service: RequestFundsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RequestFundsService],
      imports: [Neo4jModule.forRoot(DB_CONNECTIONS_CONFIGS), UsersModule],
    }).compile();

    service = module.get<RequestFundsService>(RequestFundsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
