import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class SendFundsService {
  constructor(
    private readonly neo4j: Neo4jService,
    private readonly userService: UsersService,
  ) {}

  


}
