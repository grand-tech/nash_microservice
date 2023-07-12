import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../app.module';
import { UsersModule } from './users.module';
import { UsersService } from './users.service';

describe('User Controller RBAC Route Check.', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it(`Check if create new crypto wallet exists.`, () => {
    const forbiddenResponse = {
      message: 'Forbidden resource',
      error: 'Forbidden',
      statusCode: 403,
    };
    return request(app.getHttpServer())
      .get('/createnewcryptowallet')
      .expect(403)
      .expect(forbiddenResponse);
  });
});

describe('User Controller Mock Method Calls.', () => {
  let app: INestApplication;
  let userService = {
    createCryptoAccount: () => {
      return {
        status: 200,
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
});
