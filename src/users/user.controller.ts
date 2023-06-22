import { Controller } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { nodeToUser, User } from '../../src/datatypes/user/user';

@Controller('user')
export class UserController {
  
}
