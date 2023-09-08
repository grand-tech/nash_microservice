import * as admin from 'firebase-admin';
import { Injectable } from '@nestjs/common';
import { firebaseConfig } from './firebase.config';

@Injectable()
export class FirebaseService {
  private readonly app: admin.app.App;
  private readonly firebaseInitialized: boolean = false;

  constructor() {
    try {
      if (!admin.apps.length || admin.apps.length === 0) {
        this.app = admin.initializeApp({
          credential: admin.credential.cert(firebaseConfig),
          databaseURL: `https://${firebaseConfig.projectId}.firebaseio.com`,
        });
      } else {
        let fbIsInit = false;
        admin.apps.forEach((app) => {
          if (app.name === '[DEFAULT]') {
            fbIsInit = true;
          }
        });
        if (!fbIsInit) {
          this.app = admin.initializeApp({
            credential: admin.credential.cert(firebaseConfig),
            databaseURL: `https://${firebaseConfig.projectId}.firebaseio.com`,
          });
        }
      }
      this.firebaseInitialized = true;
    } catch (e) {
      this.firebaseInitialized = false;
      console.error(e);
    }
  }

  getFirebaseInitialized(): boolean {
    return this.firebaseInitialized;
  }

  getFirebaseApp(): admin.app.App {
    return this.app;
  }
}
