import * as admin from 'firebase-admin';
import * as fs from 'fs';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FirebaseService {
  private readonly app: admin.app.App;
  private readonly firebaseInitialized: boolean = false;
  private readonly file: string = '/home/jamie/Code/Saltie/Nash/nash_backend/cert/jamie-playgound-firebase-adminsdk.json';

  constructor() {
    try {
      const firebaseConfig = JSON.parse(
        fs.readFileSync(this.file, 'utf8').toString(),
      );
      if (!admin.apps.length || admin.apps.length === 0) {
        this.app = admin.initializeApp({
          credential: admin.credential.cert(firebaseConfig),
          databaseURL: 'https://jamie-playgound.firebaseio.com',
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
            databaseURL: 'https://<your-project-id>.firebaseio.com',
          });
        }
      }
      this.firebaseInitialized = true;
    } catch (e) {
      console.log(e);
    }
  }

  getFirebaseInitialized(): boolean {
    return this.firebaseInitialized;
  }

  getFirebaseApp(): admin.app.App {
    return this.app;
  }
}