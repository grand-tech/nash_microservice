import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { nodeToUser, User } from '../../src/datatypes/user/user';
import { Response } from 'src/utils/response';

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
      email: user.email,
      feduid: user.feduid,
      labels: label,
    };

    const rst = await this.neo4j.write(
      'CREATE (user:User :' +
        label.trim() +
        ' { email: $email, feduid: $feduid}) RETURN user',
      params,
    );

    if (rst.records.length > 0) {
      const usr = rst.records[0].get('user');
      return nodeToUser(usr);
    } else {
      return new User();
    }
  }

  /**
   * Creates a user with a customer role.
   * @param user the user information.
   * @returns a proimise of the created record.
   */
  async createCustomer(user: User): Promise<User> {
    user.feduid = user.feduid.trim();
    if (user.feduid != '') {
      const usr = await this.getUser(user.feduid);
      if (usr.feduid) {
        return usr;
      } else {
        return await this.createUser(user, 'Customer');
      }
    } else {
      return new User();
    }
  }

  /**
   * Validates a new user.
   * @param user the new users information.
   * @returns the user record created in the database.
   */
  async validateNewUser(user: User): Promise<Response> {
    const response: Response = {
      status: 200,
      message: 'Success',
      body: undefined,
    };

    if (typeof user.feduid != 'undefined' && user.feduid != '') {
      const usr = await this.createCustomer(user);

      if (usr?.id?.valueOf() ?? 0 > 0) {
        response.body = usr;
      } else {
        response.status = 501;
        response.message = 'Error signing up to system.';
      }
    } else {
      response.status = 500;
      response.message = 'Invalid session key!!';
    }

    return response;
  }
}
