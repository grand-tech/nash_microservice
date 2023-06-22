import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { nodeToUser, User } from '../../src/datatypes/user/user';

@Injectable()
export class UsersService {
  constructor(private readonly neo4j: Neo4jService) {}

  /**
   * Queries for user information given their feduidd.
   * @param feduid the user`s feduid.
   * @return the queried user.
   */
  async getUser(feduid: string) {
    const rst = await this.neo4j.read(
      'MATCH (user:User) WHERE user.feduid = $feduid RETURN user',
      { feduid: feduid },
    );

    if (rst.records.length > 0) {
      const usr = rst.records[0].get('user');
      return nodeToUser(usr);
    } else {
      return new User();
    }
  }

  /**
   * Queries for user information given their feduidd.
   * @param feduid the user`s feduid.
   * @return the queried user.
   */
  async createUser(user: User, label: string) {
    const params: Record<string, any> = {
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      feduid: user.feduid,
      labels: label,
    };

    const rst = await this.neo4j.write(
      'CREATE (user:User :' +
        label.trim() +
        ' {name: $name, email: $email, ' +
        'phoneNumber: $phoneNumber, feduid: $feduid}) RETURN user',
      params,
    );

    if (rst.records.length > 0) {
      const usr = rst.records[0].get('user');
      return nodeToUser(usr);
    } else {
      return new User();
    }
  }

  async createCustomer(user: User) {}
}
