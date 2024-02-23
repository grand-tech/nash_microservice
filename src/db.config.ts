import { Neo4jConnection } from "nest-neo4j/dist";

/**
 * Database connections configs for testing.
 */
export const DB_CONNECTIONS_CONFIGS: Neo4jConnection = {
    scheme: 'neo4j+s',
    host: '2e351529.databases.neo4j.io',
    username: 'neo4j',
    password: 'Bi4McnhW3jtraWcbtxu65tGMqTrRnzNU1MSLsEdVeLc',
    port: '7687',
    database: 'neo4j',
};