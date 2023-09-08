import { Profile } from './dto/profile.dto';
import { AppUser } from './dto/app_user.dto';

export interface IAppUsersService {
  getAppUserByUid(uid: string): Promise<AppUser>;
  getAppUserByEmail(email: string): Promise<AppUser>;
  getAppUserByPhoneNumber(phoneNumber: string): Promise<AppUser>;
  createAppUser(appUser: AppUser): Promise<AppUser>;
  updateAppUser(appUser: AppUser): Promise<AppUser>;
  deleteAppUser(uid: string): Promise<AppUser>;
}

export interface IProfileService {
  getProfileByUid(uid: string): Promise<Profile>;
  getProfileByEmail(email: string): Promise<Profile>;
  getProfileByPhoneNumber(phoneNumber: string): Promise<Profile>;
  createProfile(profile: Profile): Promise<Profile>;
  updateProfile(profile: Profile): Promise<Profile>;
  deleteProfile(uid: string): Promise<Profile>;
}
