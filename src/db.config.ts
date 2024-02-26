import { Neo4jConnection } from "nest-neo4j/dist";

/**
 * Database connections configs for testing.
 */
export const DB_CONNECTIONS_CONFIGS: Neo4jConnection = {
    scheme: 'neo4j+s',
    host: '04c46740.databases.neo4j.io',
    username: 'neo4j',
    password: 'DzsmVwuaLRFPs8JrSZs0cFllgORNVFZYuBZEKHh5GVQ',
    port: '7687',
    database: 'neo4j',
};