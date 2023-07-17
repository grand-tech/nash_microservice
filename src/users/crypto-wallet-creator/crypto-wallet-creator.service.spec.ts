import { Test, TestingModule } from '@nestjs/testing';
import {
  CryptoWalletCreatorService,
  getAccountInformation,
} from './crypto-wallet-creator.service';
import { TEST_ACC_1 } from '../../../test/test-utils/test.accounts';

describe('CryptoWalletCreatorService', () => {
  let service: CryptoWalletCreatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CryptoWalletCreatorService],
    }).compile();

    service = module.get<CryptoWalletCreatorService>(
      CryptoWalletCreatorService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Test Validate Private Keys', () => {
    it('Valid private key.', () => {
      const acc = getAccountInformation(TEST_ACC_1.privateKey);

      expect(acc.address).toBe(TEST_ACC_1.address);
      expect(acc.privateKey).toBe('0x' + TEST_ACC_1.privateKey);

      const acc2 = getAccountInformation('0x' + TEST_ACC_1.privateKey);

      expect(acc2.address).toBe(TEST_ACC_1.address);
      expect(acc2.privateKey).toBe('0x' + TEST_ACC_1.privateKey);
    });

    it('In-valid private key.', () => {
      const acc = getAccountInformation(TEST_ACC_1.publicKey);
      expect(acc.address).toBe(undefined);
      expect(acc.privateKey).toBe(undefined);
    });
  });
});
