import { Neo4jConnection } from 'nest-neo4j/dist';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Database connections configs for testing.
 */
export const DB_CONNECTIONS_CONFIGS: Neo4jConnection = {
  scheme: 'neo4j+s',
  host: process.env.DATABASE_HOST,
  username: process.env.NOE4_USER_NAME,

  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE_NAME,
};
