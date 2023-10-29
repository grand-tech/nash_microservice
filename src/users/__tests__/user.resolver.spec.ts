import request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import { UsersService } from '../users.service';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

// describe('User Controller RBAC Route Check.', () => {
//   let app: NestFastifyApplication;

//   beforeAll(async () => {
//     const moduleRef = await Test.createTestingModule({
//       imports: [AppModule],
//       providers: [],
//     }).compile();


//     app = moduleRef.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
//     await app.init();
//     await app.getHttpAdapter().getInstance().ready();
//   }, 7000);

//   afterAll(async () => {
//     await app.close();
//   });

//   // it(`Add mnemonic to account.`, () => {
//   //   return request(app.getHttpServer())
//   //     .post('/add-mnemonic-to-account')
//   //     .set('Authorization', `Bearer `)
//   //     .set('Content-Type', 'application/json')
//   //     .send({ mnemonic: '123 123 123' })
//   //     .expect(403);
//   // });
// });

describe('User Controller Mock Method Calls.', () => {
  let app: NestFastifyApplication;
  let userService = {
    createCryptoAccount: () => {
      return {
        status: 200,
        message: 'createCryptoAccount',
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

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(UsersService)
      .useValue(userService)
      .compile();

    app = moduleRef.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  afterAll(async () => {
    await app.close();
  });

  // it(`Check if create new crypto wallet exists.`, () => {
  //   return request(app.getHttpServer())
  //     .get('/createnewcryptowallet')
  //     .expect(200)
  //     .expect(userService.createCryptoAccount());
  // });

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

    // return app
    //   .inject({
    //     method: 'POST',
    //     url: '/graphql',
    //     body: {
    //       query: mutation
    //     }
    //   })
    //   .then((result) => {
    //     // console.log(result)
    //     expect(result.statusCode).toEqual(200);
    //     const rsp = result.body
    //     console.log(rsp);
    //     // expect(result.payload).toEqual(/* expectedPayload */);
    //   });
  })

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
});
