import { Injectable } from '@nestjs/common';
import { FirebaseTestUtilsService } from './test-utils/firebase-test-utils/firebase-test-utils.service';

@Injectable()
export class AppService {

  constructor(private readonly firebaseTestUtils: FirebaseTestUtilsService) {}

  getHello(): string {

    this.firebaseTestUtils.auth("test@gmail.com", "test123");
    return 'Hello World!';
  }
}
