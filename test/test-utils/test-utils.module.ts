import { Module } from '@nestjs/common';
import { FirebaseTestUtilsService } from './firebase-test-utils/firebase-test-utils.service';
import { HttpModule } from '@nestjs/axios';
import { Neo4jConnection, Neo4jService } from 'nest-neo4j/dist';

@Module({
  imports: [HttpModule],
  providers: [FirebaseTestUtilsService],
  exports: [FirebaseTestUtilsService],
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
