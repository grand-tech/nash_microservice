import { Test, TestingModule } from '@nestjs/testing';
import { SendFundsService } from '../send-funds.service';
import { DB_CONNECTIONS_CONFIGS } from '../../../../test/test-utils/test-utils.module';
import { Neo4jModule } from 'nest-neo4j/dist';
import { UsersModule } from '../../../users/users.module';

describe('SendFundsService', () => {
  let service: SendFundsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SendFundsService],
      imports: [Neo4jModule.forRoot(DB_CONNECTIONS_CONFIGS), UsersModule],
    }).compile();

    service = module.get<SendFundsService>(SendFundsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
