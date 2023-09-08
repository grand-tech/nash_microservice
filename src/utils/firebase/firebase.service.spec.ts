import { Test, TestingModule } from '@nestjs/testing';
import { FirebaseService } from './firebase.service';

describe('FirebaseService', () => {
  let service: FirebaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FirebaseService],
    }).compile();

    service = module.get<FirebaseService>(FirebaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should initialize firebase', async () => {
    const firebaseInitialized = service.getFirebaseInitialized();
    expect(firebaseInitialized).toBeDefined();
    expect(firebaseInitialized).toEqual(true);
  });

  it('should get firebase app', async () => {
    const firebaseApp = await service.getFirebaseApp();
    expect(firebaseApp).toBeDefined();
  });

  it('should get firebase initialized', async () => {
    const firebaseInitialized = service.getFirebaseInitialized();
    expect(firebaseInitialized).toBeDefined();
    expect(firebaseInitialized).toEqual(true);
  });
});
