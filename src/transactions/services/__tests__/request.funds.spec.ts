import { Test, TestingModule } from '@nestjs/testing';
import { DB_CONNECTIONS_CONFIGS } from '../../../../test/test-utils/test-utils.module';
import { Neo4jModule, Neo4jService } from 'nest-neo4j/dist';
import { UsersModule } from '../../../users/users.module';
import assert from 'assert';
import {
    TEST_ACC_1,
    TEST_ACC_2,
} from '../../../../test/test-utils/test.accounts';
import { User } from '../../../datatypes/user/user';
import { initializeContractKit } from '../../../utils/block-chain-utils/contract.kit.utils'
import { RequestFundsService } from '../request-funds.service';
import { FundsRequest, nodeToFundsRequest } from '../../../datatypes/transaction/funds.request';

describe('RequestFundsService : CREATE TRANSACTION REQUEST CYPHER QUERY : TEST SUIT', () => {
    let service: RequestFundsService;
    let dbService: Neo4jService;
    let app: TestingModule;

    beforeAll(async () => {
        initializeContractKit();
        app = await Test.createTestingModule({
            providers: [RequestFundsService],
            imports: [Neo4jModule.forRoot(DB_CONNECTIONS_CONFIGS), UsersModule],
        }).compile();

        service = app.get<RequestFundsService>(RequestFundsService);
        dbService = app.get<Neo4jService>(Neo4jService);
        await setUpTestUsers(dbService);
    });

    afterAll(async () => {
        await deleteUsers(dbService);
        await dbService.getDriver().close();
        await app.close();
    }, 7000);

    it('Test create transaction request cypher query.', async () => {
        const initiator = new User();
        initiator.publicAddress = TEST_ACC_1.address;
        initiator.privateKey = TEST_ACC_1.privateKey;
        initiator.feduid = '1234567890';

        const recipient = new User();
        recipient.publicAddress = TEST_ACC_2.address;
        recipient.privateKey = TEST_ACC_1.privateKey;
        recipient.feduid = '1234567891';

        const tx = await service.requestFundsCypherQry(0.0001, 'Test Transaction', initiator, recipient);
        expect(tx.records[0].get('tx')).toBeDefined;
        expect(tx.records[0].get('initiatorDay')).toBeDefined;
        expect(tx.records[0].get('targetDay')).toBeDefined;
        expect(tx.records[0].get('initiator')).toBeDefined;
        expect(tx.records[0].get('target')).toBeDefined;

        expect(tx.records[0].get('initiator').timestamp).toBe(
            tx.records[0].get('target').timestamp,
        );

        const savedTxRequest: FundsRequest = nodeToFundsRequest(tx.records[0].get('tx'));

        expect(savedTxRequest.amount).toBe(0.0001);
        expect(savedTxRequest.stableCoin).toBe('cUSD');
        expect(savedTxRequest.network).toBe('CELO');
        expect(savedTxRequest.initiatorAddress).toBe(initiator.publicAddress);
        expect(savedTxRequest.fulfilled).toBe(false);
    }, 12000);
});

async function setUpTestUsers(dbService: Neo4jService) {
    const qry = `CREATE (user1:User {feduid: $feduid1, publicAddress: $publicAddress1, privateKey: $privateKey1}), 
     (user2: User {feduid: $feduid2, publicAddress: $publicAddress2, privateKey: $privateKey2})RETURN user1, user2`;

    const rst = await dbService.write(qry, {
        feduid1: '1234567890',
        publicAddress1: TEST_ACC_1.address,
        privateKey1: TEST_ACC_1.privateKey,
        feduid2: '1234567891',
        publicAddress2: TEST_ACC_2.address,
        privateKey2: TEST_ACC_2.privateKey,
    });

    rst.records[0].get('user1');
    rst.records[0].get('user2');

    assert(rst.records[0].keys.length == 2, 'Id is valid.');
}

async function deleteUsers(dbService: Neo4jService) {
    const qry = `MATCH (u:User)-[:REQUESTED_FUNDS_ON]-(d:Day)-[:RECORDED]-(t:FundsRequest)
   WHERE u.publicAddress = $address1 OR u.publicAddress = $address2
   DETACH DELETE t DETACH DELETE u DETACH DELETE d`;

    await dbService.write(qry, {
        address1: TEST_ACC_1.address,
        address2: TEST_ACC_2.address,
    });
}
