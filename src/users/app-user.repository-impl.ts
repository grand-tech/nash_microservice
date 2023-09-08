import { Neo4jService } from 'nest-neo4j/dist';
import { Injectable } from '@nestjs/common';
import { Profile } from './dto/profile.dto';
import { AppUser } from './dto/app_user.dto';
import { IAppUsersService, IProfileService } from './app-user.repository';

@Injectable()
export class AppUserRepositoryImpl implements IAppUsersService {
  constructor(private readonly neo4jService: Neo4jService) {}

  async getAppUserByUid(uid: string): Promise<AppUser> {
    try {
      const result = await this.neo4jService.read(
        `MATCH (u:AppUser {uid: $uid}) RETURN u`,
        { uid: uid },
      );
      if (result.records.length > 0) {
        return AppUser.fromJSON(result.records[0].get('u').properties);
      } else {
        return null;
      }
    } catch (e) {
      throw new Error(e.message);
    }
  }
  async getAppUserByEmail(email: string): Promise<AppUser> {
    try {
      const result = await this.neo4jService.read(
        `MATCH (u:AppUser {email: $email}) RETURN u`,
        { email: email },
      );
      if (result.records.length > 0) {
        return AppUser.fromJSON(result.records[0].get('u').properties);
      } else {
        return null;
      }
    } catch (e) {
      throw new Error(e.message);
    }
  }
  async getAppUserByPhoneNumber(phoneNumber: string): Promise<AppUser> {
    try {
      const result = await this.neo4jService.read(
        `MATCH (u:AppUser {phoneNumber: $phoneNumber}) RETURN u`,
        { phoneNumber: phoneNumber },
      );
      if (result.records.length > 0) {
        return AppUser.fromJSON(result.records[0].get('u').properties);
      } else {
        return null;
      }
    } catch (e) {
      throw new Error(e.message);
    }
  }
  async createAppUser(appUser: AppUser): Promise<AppUser> {
    try {
      return this.neo4jService
        .write(`CREATE (u:AppUser $props) RETURN u`, {
          props: AppUser.toJSON(appUser),
        })
        .then((result) => {
          return AppUser.fromJSON(result.records[0].get('u').properties);
        });
    } catch (e) {
      throw new Error(e.message);
    }
  }
  async updateAppUser(appUser: AppUser): Promise<AppUser> {
    try {
      return this.neo4jService
        .write(`MATCH (u:AppUser {uid: $uid}) SET u += $props RETURN u`, {
          uid: appUser.uid,
          props: AppUser.toJSON(appUser),
        })
        .then((result) => {
          return AppUser.fromJSON(result.records[0].get('u').properties);
        });
    } catch (e) {
      throw new Error(e.message);
    }
  }
  deleteAppUser(uid: string): Promise<AppUser> {
    try {
      return this.neo4jService
        .write(`MATCH (u:AppUser {uid: $uid}) DELETE u RETURN u`, {
          uid: uid,
        })
        .then((result) => {
          return AppUser.fromJSON(result.records[0].get('u').properties);
        });
    } catch (e) {
      throw new Error(e.message);
    }
  }
}

export class ProfileRepositoryImpl implements IProfileService {
  constructor(private readonly neo4jService: Neo4jService) {}

  async getProfileByUid(uid: string): Promise<Profile> {
    try {
      const result = await this.neo4jService.read(
        `MATCH (p:Profile {uid: $uid}) RETURN p`,
        { uid: uid },
      );
      if (result.records.length > 0) {
        return Profile.fromJSON(result.records[0].get('p').properties);
      } else {
        return null;
      }
    } catch (e) {
      throw new Error(e.message);
    }
  }
  async getProfileByEmail(email: string): Promise<Profile> {
    try {
      const result = await this.neo4jService.read(
        `MATCH (p:Profile {email: $email}) RETURN p`,
        { email: email },
      );
      if (result.records.length > 0) {
        return Profile.fromJSON(result.records[0].get('p').properties);
      } else {
        return null;
      }
    } catch (e) {
      throw new Error(e.message);
    }
  }
  async getProfileByPhoneNumber(phoneNumber: string): Promise<Profile> {
    try {
      const result = await this.neo4jService.read(
        `MATCH (p:Profile {phoneNumber: $phoneNumber}) RETURN p`,
        { phoneNumber: phoneNumber },
      );
      if (result.records.length > 0) {
        return Profile.fromJSON(result.records[0].get('p').properties);
      } else {
        return null;
      }
    } catch (e) {
      throw new Error(e.message);
    }
  }
  async createProfile(profile: Profile): Promise<Profile> {
    try {
      return this.neo4jService
        .write(`CREATE (p:Profile $props) RETURN p`, {
          props: Profile.toJSON(profile),
        })
        .then((result) => {
          return Profile.fromJSON(result.records[0].get('p').properties);
        });
    } catch (e) {
      throw new Error(e.message);
    }
  }
  async updateProfile(profile: Profile): Promise<Profile> {
    try {
      return this.neo4jService
        .write(`MATCH (p:Profile {uid: $uid}) SET p += $props RETURN p`, {
          uid: profile.uid,
          props: Profile.toJSON(profile),
        })
        .then((result) => {
          return Profile.fromJSON(result.records[0].get('p').properties);
        });
    } catch (e) {
      throw new Error(e.message);
    }
  }
  deleteProfile(uid: string): Promise<Profile> {
    try {
      return this.neo4jService
        .write(`MATCH (p:Profile {uid: $uid}) DELETE p RETURN p`, {
          uid: uid,
        })
        .then((result) => {
          return Profile.fromJSON(result.records[0].get('p').properties);
        });
    } catch (e) {
      throw new Error(e.message);
    }
  }
}
