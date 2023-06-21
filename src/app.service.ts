import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { nodeToUser } from './datatypes/user/user';

@Injectable()
export class AppService {
  constructor(
    // private readonly neo4j: Neo4jService,
  ) {}

  getHello(): string {
    // this.firebaseTestUtils.auth('test@gmail.com', 'test123');

    // const params: Record<string, any> = {
    //   name: 'Allen',
    //   title: 'Developer',
    // };

    // const rst = await this.neo4j.write(
    //   'CREATE (user:User {name: $name, title: $title}) RETURN user',
    //   params,
    // );
    // const user = rst.records[0].get('user');
    // const u = nodeToUser(user);
    // console.log(user);
    // console.log(u)

    return 'Hello World!';
  }
}
