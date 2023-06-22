import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UsersService } from './users.service';
import { Neo4jModule } from 'nest-neo4j/dist';
import { DB_CONNECTIONS_CONFIGS } from '../../test/test-utils/test-utils.module';

describe('User Controller', () => {
  let userController: UserController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UsersService],
      imports: [Neo4jModule.forRoot(DB_CONNECTIONS_CONFIGS)],
    }).compile();

    userController = app.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });
});
