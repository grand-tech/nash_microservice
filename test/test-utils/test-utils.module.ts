import { Module } from '@nestjs/common';
import { FirebaseTestUtilsService } from './firebase-test-utils/firebase-test-utils.service';
import { Neo4jConnection, Neo4jService } from 'nest-neo4j/dist';
import { nodeToUser, User } from '../../src/datatypes/user/user';

@Module({
  imports: [],
  providers: [FirebaseTestUtilsService],
  exports: [FirebaseTestUtilsService],
})
export class TestUtilsModule {}

/**
 * Database connections configs for testing.
 */
export const DB_CONNECTIONS_CONFIGS: Neo4jConnection = {
  scheme: 'neo4j+s',
  host: 'afcea08f.databases.neo4j.io',
  username: 'neo4j',
  password: 'GUXx3GxgNDDyAFuVdmRmmTaWyE3Ex01yPZOtqawtV0Y',
  port: '7687',
  database: 'neo4j',
};

/**
 * Deletes a node.
 * @param id the id of the node to be deleted.
 * @param dbService the database service instance.
 */
export async function deleteNode(id: number, dbService: Neo4jService) {
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
export async function addTestUser(feduid: string, dbService: Neo4jService) {
  const params: Record<string, any> = {
    feduid: feduid,
  };

  const rst = await dbService.write(
    'MERGE (u:User {feduid: $feduid}) ON CREATE ' +
      ' SET u.name = "Test User", u.created = timestamp() ' +
      ' RETURN u',
    params,
  );

  if (rst.records.length > 0) {
    const usr = rst.records[0].get('u');
    return nodeToUser(usr);
  } else {
    return new User();
  }
}
