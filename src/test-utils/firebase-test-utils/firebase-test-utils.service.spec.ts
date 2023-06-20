import { Test, TestingModule } from '@nestjs/testing';
import { FirebaseTestUtilsService } from './firebase-test-utils.service';

describe('FirebaseTestUtilsService', () => {
  let service: FirebaseTestUtilsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FirebaseTestUtilsService],
    }).compile();

    service = module.get<FirebaseTestUtilsService>(FirebaseTestUtilsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
