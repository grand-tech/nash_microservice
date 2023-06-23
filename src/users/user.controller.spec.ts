import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UsersService } from './users.service';
import { Neo4jModule, Neo4jService } from 'nest-neo4j/dist';
import {
  DB_CONNECTIONS_CONFIGS,
  TestUtilsModule,
} from '../../test/test-utils/test-utils.module';
import { FirebaseTestUtilsService } from '../../test/test-utils/firebase-test-utils/firebase-test-utils.service';

describe('User Controller', () => {
  let userController: UserController;
  let firebaseTestUtils: FirebaseTestUtilsService;
  let dbService: Neo4jService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UsersService, FirebaseTestUtilsService],
      imports: [Neo4jModule.forRoot(DB_CONNECTIONS_CONFIGS), TestUtilsModule],
    }).compile();

    userController = app.get<UserController>(UserController);
    dbService = app.get<Neo4jService>(Neo4jService);

    firebaseTestUtils = app.get<FirebaseTestUtilsService>(
      FirebaseTestUtilsService,
    );

    const skey = await firebaseTestUtils.auth('test@gmail.com', 'test123');
  });

  afterAll(async () => {
    dbService.getDriver().close();
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });
});
