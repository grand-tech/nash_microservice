import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from '../transactions.controller';
import { SendFundsService } from '../services/send-funds.service';
import { PurchaseAirtimeService } from '../services/purchase-airtime.service';
import { RequestFundsService } from '../services/request-funds.service';
import { Neo4jModule } from 'nest-neo4j/dist';
import { DB_CONNECTIONS_CONFIGS } from '../../../test/test-utils/test-utils.module';
import { UsersModule } from '../../users/users.module';

describe('TransactionsController', () => {
  let controller: TransactionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [SendFundsService, PurchaseAirtimeService, RequestFundsService],
      imports: [Neo4jModule.forRoot(DB_CONNECTIONS_CONFIGS), UsersModule],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
