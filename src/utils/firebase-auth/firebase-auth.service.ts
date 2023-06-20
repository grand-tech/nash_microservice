import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { firebaseConfig } from './firebase.config';

@Injectable()
export class FirebaseAuthService {

    /**
     * Instance of the firebase app.
     */
    private firebaseApp: admin.app.App;

    constructor() {
        this.firebaseApp = admin.initializeApp({
            credential: admin.credential.cert(firebaseConfig)
        })
    }

    /**
     * Getter for the auth service instance.
     * @returns the auth service instance.
     */
    getAuth = (): admin.auth.Auth => {
        return this.firebaseApp.auth()
    }
}
