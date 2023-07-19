import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../app.module';
import { UsersModule } from '../users.module';
import { UsersService } from '../users.service';

describe('User Controller RBAC Route Check.', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [],
    }).compile();

    app = moduleRef.createNestApplication();

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it(`Add mnemonic to account.`, () => {
    return request(app.getHttpServer())
      .post('/add-mnemonic-to-account')
      .set('Authorization', `Bearer `)
      .set('Content-Type', 'application/json')
      .send({ mnemonic: '123 123 123' })
      .expect(403);
  });
});

describe('User Controller Mock Method Calls.', () => {
  let app: INestApplication;
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
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [UsersModule],
    })
      .overrideProvider(UsersService)
      .useValue(userService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it(`Check if create new crypto wallet exists.`, () => {
    return request(app.getHttpServer())
      .get('/createnewcryptowallet')
      .expect(200)
      .expect(userService.createCryptoAccount());
  });

  it(`Check if add private key to account route exists.`, () => {
    return request(app.getHttpServer())
      .post('/add-privatekey-to-account')
      .expect(201)
      .expect(userService.addPrivateKeyToAccount());
  });

  it(`Check if add mnemonic to account route exists.`, () => {
    return request(app.getHttpServer())
      .post('/add-mnemonic-to-account')
      .expect(201)
      .expect(userService.addMnemonicToAccount());
  });

  it(`Check if save user profile route exists.`, () => {
    return request(app.getHttpServer())
      .post('/save-user-profile')
      .expect(201)
      .expect(userService.saveUserProfile());
  });
});
