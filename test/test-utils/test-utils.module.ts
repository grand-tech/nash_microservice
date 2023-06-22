import { Module } from '@nestjs/common';
import { FirebaseTestUtilsService } from './firebase-test-utils/firebase-test-utils.service';
import { HttpModule } from '@nestjs/axios';
import { Neo4jConnection } from 'nest-neo4j/dist';

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
