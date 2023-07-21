import { Test, TestingModule } from '@nestjs/testing';
import { MPesaApisService } from '../m-pesa-apis.service';
import { HttpModule } from '@nestjs/axios';

describe('MPesaApisService', () => {
  let service: MPesaApisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MPesaApisService],
      imports: [HttpModule],
    }).compile();

    service = module.get<MPesaApisService>(MPesaApisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // it('Test STK push transaction.', async () => {
  //   console.log('====================>');
  //   const rsp = await service.initSTKPush(2, '254791725651', '', 0);
  //   // console.log('====================>', rsp);
  //   expect(service).toBeDefined();
  // });

  // it('Test B2C transactions.', async () => {
  //   console.log('====================>');
  //   const rsp = await service.b2cTransaction('254791725651', 2, '', 0);
  //   console.log('====================>', rsp);
  //   expect(service).toBeDefined();
  // });
});
