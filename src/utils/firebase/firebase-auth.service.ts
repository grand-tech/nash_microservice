import { Injectable } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { CommonUtils, Logger } from '../common/common.utils';

@Injectable()
class FirebaseUsersUtils {
  logger = new Logger('FirebaseUsersUtils');

  constructor(private readonly firebaseService: FirebaseService) {}

  async verifyToken(idToken: string) {
    if (!this.firebaseService.getFirebaseInitialized()) {
      this.logger.error('Firebase is not initialized');
      throw new Error('Firebase is not initialized');
    }
    try {
      return await this.firebaseService
        .getFirebaseApp()
        .auth()
        .verifyIdToken(idToken);
    } catch (e) {
      throw new Error(e);
    }
  }

  async createUser(password: string, email?: string, phoneNumber?: string) {
    if (!this.firebaseService.getFirebaseInitialized()) {
      this.logger.error('Firebase is not initialized');
      throw new Error('Firebase is not initialized');
    }
    const randomString = CommonUtils.generateRandomString(15).toUpperCase();
    const uid = `NASH${randomString}`;
    try {
      return await this.firebaseService.getFirebaseApp().auth().createUser({
        uid,
        email,
        phoneNumber,
        password,
      });
    } catch (e) {
      throw new Error(e);
    }
  }

  async getUserById(uid: string) {
    if (!this.firebaseService.getFirebaseInitialized()) {
      this.logger.error('Firebase is not initialized');
      throw new Error('Firebase is not initialized');
    }
    try {
      return await this.firebaseService.getFirebaseApp().auth().getUser(uid);
    } catch (e) {
      throw new Error(e);
    }
  }

  async deleteUser(uid: string) {
    if (!this.firebaseService.getFirebaseInitialized()) {
      this.logger.error('Firebase is not initialized');
      throw new Error('Firebase is not initialized');
    }
    try {
      return await this.firebaseService.getFirebaseApp().auth().deleteUser(uid);
    } catch (e) {
      throw new Error(e);
    }
  }

  async getUserByPhoneNumber(phoneNumber: string) {
    if (!this.firebaseService.getFirebaseInitialized()) {
      this.logger.error('Firebase is not initialized');
      throw new Error('Firebase is not initialized');
    }
    try {
      return await this.firebaseService
        .getFirebaseApp()
        .auth()
        .getUserByPhoneNumber(phoneNumber);
    } catch (e) {
      throw new Error(e);
    }
  }

  async getUserByEmail(uid: string) {
    if (!this.firebaseService.getFirebaseInitialized()) {
      this.logger.error('Firebase is not initialized');
      throw new Error('Firebase is not initialized');
    }
    try {
      return await this.firebaseService.getFirebaseApp().auth().getUser(uid);
    } catch (e) {
      throw new Error(e);
    }
  }

  async listUsers(maxResults: number, pageToken: string) {
    if (!this.firebaseService.getFirebaseInitialized()) {
      this.logger.error('Firebase is not initialized');
      throw new Error('Firebase is not initialized');
    }
    try {
      return await this.firebaseService
        .getFirebaseApp()
        .auth()
        .listUsers(maxResults, pageToken);
    } catch (e) {
      throw new Error(e);
    }
  }

  async updateUser(
    uid: string,
    email?: string,
    phoneNumber?: string,
    emailVerified?: boolean,
    photoURL?: string,
    disabled?: boolean,
    password?: string,
  ) {
    try {
      if (!this.firebaseService.getFirebaseInitialized()) {
        this.logger.error('Firebase is not initialized');
        throw new Error('Firebase is not initialized');
      }
      return await this.firebaseService
        .getFirebaseApp()
        .auth()
        .updateUser(uid, {
          email,
          phoneNumber,
          emailVerified,
          photoURL,
          disabled,
          password,
        });
    } catch (e) {
      throw new Error(e);
    }
  }
}

export { FirebaseUsersUtils };
