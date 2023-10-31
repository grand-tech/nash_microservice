import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

// Dev firebase configs
const firebaseConfig = {
  apiKey: "AIzaSyCc5q04PhHh4ueZnr59qwp2-polZ_fU9CU",
  authDomain: "nash-dev.firebaseapp.com",
  projectId: "nash-dev",
  storageBucket: "nash-dev.appspot.com",
  messagingSenderId: "1073559611016",
  appId: "1:1073559611016:web:e5c388d37f2e8040e8a13d",
  measurementId: "G-XVW1ZTKGJQ"
}

@Injectable()
export class FirebaseTestUtilsService {
  constructor() { }

  /**
   * Authenticates the user for testing.
   * @param email the email address.
   * @param pass the user password.
   */
  async auth(email: string, pass: string): Promise<FirebaseTestUser> {
    const user: FirebaseTestUser = {
      feduid: '',
      skey: '',
    };

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app)

    const userCredential = await signInWithEmailAndPassword(auth, email, pass)

    user.skey = await userCredential.user.getIdToken()
    user.feduid = userCredential.user.providerId

    return user;
  }
}

/**
 * Contains necessary data from identity toolkit.
 * @param feduid the users feduid.
 * @param skey the key used as bearer token.
 */
export interface FirebaseTestUser {
  feduid: string;
  skey: string;
}
