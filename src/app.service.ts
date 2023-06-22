import { Injectable } from '@nestjs/common';
import { nodeToUser } from './datatypes/user/user';

@Injectable()
export class AppService {
  constructor() {} // private readonly neo4j: Neo4jService,

  getHello(): string {
    return 'Hello World!';
  }
}
