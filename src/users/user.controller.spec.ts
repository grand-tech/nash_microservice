import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../app.module';
import { Neo4jService } from 'nest-neo4j/dist';
import {
  TestUtilsModule,
  addTestUser,
  deleteNode,
} from '../../test/test-utils/test-utils.module';
import { FirebaseTestUtilsService } from '../../test/test-utils/firebase-test-utils/firebase-test-utils.service';

describe('User Controller RBAC Route Check.', () => {
  let app: INestApplication;
  let dbService: Neo4jService;
  let testUtils: FirebaseTestUtilsService;
  let userID: number;
  let TOKEN;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, TestUtilsModule],
      providers: [FirebaseTestUtilsService],
    }).compile();

    app = moduleRef.createNestApplication();
  

    dbService = moduleRef.get<Neo4jService>(Neo4jService);
    testUtils = moduleRef.get<FirebaseTestUtilsService>(
      FirebaseTestUtilsService,
    );

    const user = await testUtils.auth('test@gmail.com', 'test123');
    if ((user?.feduid ?? '') != '') {
      const u = await addTestUser(user.feduid, [], dbService);
      userID = u.id;
      TOKEN = user.skey;
    }
    await app.init();
  });

  afterAll(async () => {
    await deleteNode(userID, dbService);
    await app.close();
    await dbService.getDriver().close();
  });

  //   it(`Check if create new crypto wallet exists.`, () => {
  //     const forbiddenResponse = {
  //       message: 'Forbidden resource',
  //       error: 'Forbidden',
  //       statusCode: 403,
  //     };
  //     return request(app.getHttpServer())
  //       .get('/createnewcryptowallet')
  //       .expect(403)
  //       .expect(forbiddenResponse);
  //   });

  //   it(`Add private key to account`, () => {
  //     return request(app.getHttpServer())
  //       .post('/add-privatekey-to-account')
  //       .expect(200);
  //     // .expect();
  //   });

  it(`Add mnemonic to account.`, () => {
    return request(app.getHttpServer())
      .post('/add-mnemonic-to-account')
      .set('Authorization', `Bearer ${TOKEN}`)
      .set('Content-Type', 'application/json')
      .send({ mnemonic: '123 123 123' })
      .expect(200);
    // .expect(userService.createCryptoAccount());
  });
});

// describe('User Controller Mock Method Calls.', () => {
//   let app: INestApplication;
//   let userService = {
//     createCryptoAccount: () => {
//       return {
//         status: 200,
//       };
//     },
//   };

//   beforeAll(async () => {
//     const moduleRef = await Test.createTestingModule({
//       imports: [UsersModule],
//     })
//       .overrideProvider(UsersService)
//       .useValue(userService)
//       .compile();

//     app = moduleRef.createNestApplication();
//     await app.init();
//   });

//   afterAll(async () => {
//     await app.close();
//   });

//   it(`Check if create new crypto wallet exists.`, () => {
//     return request(app.getHttpServer())
//       .get('/createnewcryptowallet')
//       .expect(200)
//       .expect(userService.createCryptoAccount());
//   });
// });
