import { Injectable } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { Logger } from '../common/common.utils';

@Injectable()
class FirebaseMessagingUtils {
  logger = new Logger('FirebaseMessagingUtils');
  constructor(private readonly firebaseService: FirebaseService) {}

  async sendNotification(
    registrationToken: string,
    title: string,
    body: string,
    data?: any,
  ) {
    if (!this.firebaseService.getFirebaseInitialized()) {
      this.logger.error('Firebase is not initialized');
      throw new Error('Firebase is not initialized');
    }
    try {
      const message = {
        notification: {
          title,
          body,
        },
        data: data,
        token: registrationToken,
      };
      return await this.firebaseService
        .getFirebaseApp()
        .messaging()
        .send(message);
    } catch (e) {
      throw new Error(e);
    }
  }

  async sendNotificationToTopic(
    topic: string,
    title: string,
    body: string,
    data?: any,
  ) {
    if (!this.firebaseService.getFirebaseInitialized()) {
      this.logger.error('Firebase is not initialized');
      throw new Error('Firebase is not initialized');
    }
    try {
      const message = {
        notification: {
          title,
          body,
        },
        data: data,
        topic: topic,
      };
      return await this.firebaseService
        .getFirebaseApp()
        .messaging()
        .send(message);
    } catch (e) {
      throw new Error(e);
    }
  }

  async subscribeToTopic(registrationToken: string, topic: string) {
    if (!this.firebaseService.getFirebaseInitialized()) {
      this.logger.error('Firebase is not initialized');
      throw new Error('Firebase is not initialized');
    }
    try {
      await this.firebaseService
        .getFirebaseApp()
        .messaging()
        .subscribeToTopic(registrationToken, topic);
      return true;
    } catch (e) {
      throw new Error(e);
    }
  }

  async unsubscribeFromTopic(registrationToken: string, topic: string) {
    if (!this.firebaseService.getFirebaseInitialized()) {
      this.logger.error('Firebase is not initialized');
      throw new Error('Firebase is not initialized');
    }
    try {
      await this.firebaseService
        .getFirebaseApp()
        .messaging()
        .unsubscribeFromTopic(registrationToken, topic);
      return true;
    } catch (e) {
      throw new Error(e);
    }
  }

  async sendMulticast(
    registrationTokens: string[],
    title: string,
    body: string,
    data?: any,
  ) {
    if (!this.firebaseService.getFirebaseInitialized()) {
      this.logger.error('Firebase is not initialized');
      throw new Error('Firebase is not initialized');
    }
    try {
      const message = {
        notification: {
          title,
          body,
        },
        data: data,
        tokens: registrationTokens,
      };
      return await this.firebaseService
        .getFirebaseApp()
        .messaging()
        .sendMulticast(message);
    } catch (e) {
      throw new Error(e);
    }
  }
}

export { FirebaseMessagingUtils };
