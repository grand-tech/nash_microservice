import { Test, TestingModule } from '@nestjs/testing';
import { CommonUtils } from './common.utils';

describe('CommonUtils', () => {
  let commonUtils: CommonUtils;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommonUtils],
    }).compile();

    commonUtils = module.get<CommonUtils>(CommonUtils);
  });

  it('should be defined', () => {
    expect(commonUtils).toBeDefined();
  });

  it('should get logger', () => {
    const logger = commonUtils.getLogger('test');
    expect(logger).toBeDefined();
  });

  /**
   * The Rest is just logging, so we don't need to test it
   */
});
