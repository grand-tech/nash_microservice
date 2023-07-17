import { Module } from '@nestjs/common';
import { FirebaseTestUtilsService } from './firebase-test-utils/firebase-test-utils.service';
import { HttpModule } from '@nestjs/axios';
import { Neo4jConnection, Neo4jService } from 'nest-neo4j/dist';
import { nodeToUser, User } from '../../src/datatypes/user/user';

@Module({
  imports: [HttpModule],
  providers: [FirebaseTestUtilsService],
  exports: [FirebaseTestUtilsService, HttpModule],
})
export class TestUtilsModule {}

/**
 * Database connections configs for testing.
 */
export const DB_CONNECTIONS_CONFIGS: Neo4jConnection = {
  scheme: 'neo4j+s',
  host: '5991cc59.databases.neo4j.io',
  username: 'neo4j',
  password: 'E5WWlP7pTcYuCQaVGF29nAF4ytmmO_HSs3kFOrK8n_g',
  port: 7687,
  database: 'neo4j',
};

/**
 * Deletes a node.
 * @param id the id of the node to be deleted.
 * @param dbService the database service instance.
 */
export async function deleteNode(id: Number, dbService: Neo4jService) {
  const rst = await dbService.write(
    'MATCH (n) WHERE ID(n)=$id DETACH DELETE n',
    {
      id: id,
    },
  );
  return rst;
}

/**
 * Creates a test user record in the database.
 * @param email the email of the user.
 * @param feduid the users feduid.
 * @param roles the users role.
 * @param dbService the database connection.
 * @return the saved user record.
 */
export async function addTestUser(
  feduid: string,
  roles: string[],
  dbService: Neo4jService,
) {
  let label = '';

  for (let index = 0; index < roles.length; index++) {
    label = ' :' + roles[index];
  }

  const params: Record<string, any> = {
    feduid: feduid,
    labels: label,
  };

  const rst = await dbService.write(
    'CREATE (user:User' + label + ' { feduid: $feduid} ) RETURN user',
    params,
  );

  if (rst.records.length > 0) {
    const usr = rst.records[0].get('user');
    return nodeToUser(usr);
  } else {
    return new User();
  }
}
