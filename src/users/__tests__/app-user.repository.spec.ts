import { Test, TestingModule } from '@nestjs/testing';
import {
  AppUserRepositoryImpl,
  ProfileRepositoryImpl,
} from '../app-user.repository-impl';

describe('AppUserRepositoryImpl', () => {
  it('should be defined', async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppUserRepositoryImpl, ProfileRepositoryImpl],
    }).compile();
    const appUserRepositoryImpl = module.get<AppUserRepositoryImpl>(
      AppUserRepositoryImpl,
    );
    expect(appUserRepositoryImpl).toBeDefined();
  });
  it('should get user by uid', async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppUserRepositoryImpl, ProfileRepositoryImpl],
    }).compile();
    const appUserRepositoryImpl = module.get<AppUserRepositoryImpl>(
      AppUserRepositoryImpl,
    );
    const user = await appUserRepositoryImpl.getAppUserByUid('test');
    expect(user).toBeDefined();
  });

  it('should get user by email', async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppUserRepositoryImpl, ProfileRepositoryImpl],
    }).compile();
    const appUserRepositoryImpl = module.get<AppUserRepositoryImpl>(
      AppUserRepositoryImpl,
    );
    const user = await appUserRepositoryImpl.getAppUserByEmail('test');
    expect(user).toBeDefined();
  });

  it('should get user by username', async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppUserRepositoryImpl, ProfileRepositoryImpl],
    }).compile();
    const appUserRepositoryImpl = module.get<AppUserRepositoryImpl>(
      AppUserRepositoryImpl,
    );
    const user = await appUserRepositoryImpl.getAppUserByUsername('test');
    expect(user).toBeDefined();
  });

  it('should get user by phone', async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppUserRepositoryImpl, ProfileRepositoryImpl],
    }).compile();
    const appUserRepositoryImpl = module.get<AppUserRepositoryImpl>(
      AppUserRepositoryImpl,
    );
    const user = await appUserRepositoryImpl.getAppUserByPhoneNumber('test');
    expect(user).toBeDefined();
  });
});

describe('ProfileRepositoryImpl', () => {
  it('should be defined', async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppUserRepositoryImpl, ProfileRepositoryImpl],
    }).compile();
    const profileRepositoryImpl = module.get<ProfileRepositoryImpl>(
      ProfileRepositoryImpl,
    );
    expect(profileRepositoryImpl).toBeDefined();
  });

  it('should get profile by uid', async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppUserRepositoryImpl, ProfileRepositoryImpl],
    }).compile();
    const profileRepositoryImpl = module.get<ProfileRepositoryImpl>(
      ProfileRepositoryImpl,
    );
    const profile = await profileRepositoryImpl.getProfileByUid('test');
    expect(profile).toBeDefined();
  });

  it('should get profile by username', async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppUserRepositoryImpl, ProfileRepositoryImpl],
    }).compile();
    const profileRepositoryImpl = module.get<ProfileRepositoryImpl>(
      ProfileRepositoryImpl,
    );
    const profile = await profileRepositoryImpl.getProfileByUsername('test');
    expect(profile).toBeDefined();
  });

  it('should get profile by email', async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppUserRepositoryImpl, ProfileRepositoryImpl],
    }).compile();
    const profileRepositoryImpl = module.get<ProfileRepositoryImpl>(
      ProfileRepositoryImpl,
    );
    const profile = await profileRepositoryImpl.getProfileByEmail('test');
    expect(profile).toBeDefined();
  });

  it('should get profile by phone', async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppUserRepositoryImpl, ProfileRepositoryImpl],
    }).compile();
    const profileRepositoryImpl = module.get<ProfileRepositoryImpl>(
      ProfileRepositoryImpl,
    );
    const profile = await profileRepositoryImpl.getProfileByPhoneNumber('test');
    expect(profile).toBeDefined();
  });

  it('should get profile by id', async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppUserRepositoryImpl, ProfileRepositoryImpl],
    }).compile();
    const profileRepositoryImpl = module.get<ProfileRepositoryImpl>(
      ProfileRepositoryImpl,
    );
    const profile = await profileRepositoryImpl.getProfileByUid('test');
    expect(profile).toBeDefined();
  });
  it('should get profile by id', async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppUserRepositoryImpl, ProfileRepositoryImpl],
    }).compile();
    const profileRepositoryImpl = module.get<ProfileRepositoryImpl>(
      ProfileRepositoryImpl,
    );
    const profile = await profileRepositoryImpl.getProfileById('test');
    expect(profile).toBeDefined();
  });
});
