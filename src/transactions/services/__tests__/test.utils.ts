import { Neo4jService } from 'nest-neo4j/dist';
import {
  TEST_ACC_1,
  TEST_ACC_2,
} from '../../../../test/test-utils/test.accounts';

export async function deleteUsers(dbService: Neo4jService) {
  const qry = `MATCH (u:User)-[:REQUESTED_FUNDS_ON|TRANSACTED_ON]-(d:Day)-[r:RECORDED]-(t:FundsRequest|Transaction)
   WHERE u.publicAddress = $address1 OR u.publicAddress = $address2 DETACH DELETE t, u, d`;

  await dbService.write(qry, {
    address1: TEST_ACC_1.address,
    address2: TEST_ACC_2.address,
  });
}
