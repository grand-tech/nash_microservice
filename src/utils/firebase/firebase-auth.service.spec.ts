import { Test, TestingModule } from '@nestjs/testing';
import { FirebaseUsersUtils } from './firebase-auth.service';

describe('FirebaseAuthService', () => {
  let service: FirebaseUsersUtils;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FirebaseUsersUtils],
    }).compile();

    service = module.get<FirebaseUsersUtils>(FirebaseUsersUtils);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should verify token', async () => {
    const verifyToken = await service.verifyToken('test');
    expect(verifyToken).toBeDefined();
  });

  it('should create user', async () => {
    const createUser = await service.createUser('test');
    expect(createUser).toBeDefined();
  });
});
