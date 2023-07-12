import { Test, TestingModule } from '@nestjs/testing';
import { CryptoWalletCreatorService } from './crypto-wallet-creator.service';

describe('CryptoWalletCreatorService', () => {
  let service: CryptoWalletCreatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CryptoWalletCreatorService],
    }).compile();

    service = module.get<CryptoWalletCreatorService>(CryptoWalletCreatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
