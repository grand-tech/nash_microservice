import request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import { UsersService } from '../users.service';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { FirebaseTestUtilsService } from '../../../test/test-utils/firebase-test-utils/firebase-test-utils.service';
import { Neo4jService } from 'nest-neo4j/dist';
import { addTestUser } from '../../../test/test-utils/test-utils.module';

// User service mock.
let userService = {
  createCryptoAccount: () => {
    return {
      status: 200,
      message: 'Success',
      body: {
        feduid: '1234567890',
        email: 'testuser@gmail.com',
        idNumber: '1234567890',
        name: 'John Doe'
      }
    };
  },
  addPrivateKeyToAccount: () => {
    return {
      status: 200,
      message: 'addPrivateKeyToAccount',
    };
  },
  addMnemonicToAccount: () => {
    return {
      status: 200,
      message: 'addMnemonicToAccount',
    };
  },
  saveUserProfile: () => {
    return {
      status: 200,
      message: 'saveUserProfile',
    };
  },
  validateNewUser: () => {
    return {
      status: 200,
      message: 'Success',
      body: {
        feduid: '1234567890',
        email: 'testuser@gmail.com',
        idNumber: '1234567890',
        name: 'John Doe'
      }
    };
  },
};


describe('User Controller Mock Method Calls.', () => {
  let testUtils: FirebaseTestUtilsService;
  let app: NestFastifyApplication;
  let db: Neo4jService;
  let skey: string;


  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [FirebaseTestUtilsService]
    })
      .overrideProvider(UsersService)
      .useValue(userService)
      .compile();

    app = moduleRef.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    await app.init();
    await app.getHttpAdapter().getInstance().ready();

    testUtils = moduleRef.get<FirebaseTestUtilsService>(FirebaseTestUtilsService)
    db = moduleRef.get<Neo4jService>(Neo4jService)

    // Get skey;
    const user = await testUtils.auth('test@gmail.com', 'test123');
    await addTestUser(user.feduid, db);
    skey = user.skey;

  }, 7000);

  afterAll(async () => {
    await app.close();
  });

  it(`Check if create new crypto wallet mutation exists.`, () => {
    const mutation = `mutation {
      createNewCryptoWallet(feduid: "1234567890" ) {
        status
        message
        body {
          name
          idNumber
          feduid
          email
        }
      }
    }`


    return request(app.getHttpServer())
      .post('/graphql')
      .set("Authorization", skey)
      .send(
        {
          query: mutation
        }
      )
      .expect(200)
      .expect((res) => {
        const rsp = res.body.data.createNewCryptoWallet
        expect(rsp.status).toBe(200)
        expect(rsp.message).toBe('Success')

        const body = rsp.body;
        expect(body.feduid).toBe('1234567890')
      });
  }, 6000);

  it(`Test sign up mutation.`, () => {

    const mutation = `mutation {
      signUp(feduid: "1234567890" ) {
        status
        message
        body {
          name
          idNumber
          feduid
          email
        }
      }
    }`

    return request(app.getHttpServer())
      .post('/graphql')
      .send(
        {
          query: mutation
        }
      )
      .expect(200)
      .expect((res) => {
        const rsp = res.body.data.signUp
        expect(rsp.status).toBe(200)
        expect(rsp.message).toBe('Success')

        const body = rsp.body;

        expect(body.feduid).toBe('1234567890')
      });

  }, 6000)

  // it(`Check if add private key to account route exists.`, () => {
  //   return request(app.getHttpServer())
  //     .post('/add-privatekey-to-account')
  //     .expect(201)
  //     .expect(userService.addPrivateKeyToAccount());
  // });

  // it(`Check if add mnemonic to account route exists.`, () => {
  //   return request(app.getHttpServer())
  //     .post('/add-mnemonic-to-account')
  //     .expect(201)
  //     .expect(userService.addMnemonicToAccount());
  // });

  // it(`Check if save user profile route exists.`, () => {
  //   return request(app.getHttpServer())
  //     .post('/save-user-profile')
  //     .expect(201)
  //     .expect(userService.saveUserProfile());
  // });

  // it(`Add mnemonic to account.`, () => {
  //   return request(app.getHttpServer())
  //     .post('/add-mnemonic-to-account')
  //     .set('Authorization', `Bearer `)
  //     .set('Content-Type', 'application/json')
  //     .send({ mnemonic: '123 123 123' })
  //     .expect(403);
  // });
});
