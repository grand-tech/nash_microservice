import { Test, TestingModule } from '@nestjs/testing';
import { DB_CONNECTIONS_CONFIGS } from '../../../../test/test-utils/test-utils.module';
import { Neo4jModule, Neo4jService } from 'nest-neo4j/dist';
import { UsersModule } from '../../../users/users.module';
import assert from 'assert';
import {
    TEST_ACC_1,
    TEST_ACC_2,
} from '../../../../test/test-utils/test.accounts';
import { initializeContractKit } from '../../../utils/block-chain-utils/contract.kit.utils'
import { RequestFundsService } from '../request-funds.service';
import { SendFundsService } from '../send-funds.service';
import { nodeToFundsRequest } from '../../../datatypes/transaction/funds.request';
import { User } from '../../../datatypes/user/user';

let inititatorFeduid = '1234567890';
let targetFeduid = '1234567891';

describe(' RequestFundsService : QUERY REQUEST FUNDS OBJECT BY ID AND TARGET : TEST SUIT', () => {
    let service: RequestFundsService;
    let sendFundsService: SendFundsService;
    let dbService: Neo4jService;
    let app: TestingModule;
    let testFundRequestID: number;


    beforeAll(async () => {
        initializeContractKit();
        app = await Test.createTestingModule({
            providers: [RequestFundsService, SendFundsService],
            imports: [Neo4jModule.forRoot(DB_CONNECTIONS_CONFIGS), UsersModule],
        }).compile();

        service = app.get<RequestFundsService>(RequestFundsService);
        sendFundsService = app.get<SendFundsService>(SendFundsService);
        dbService = app.get<Neo4jService>(Neo4jService);

        await setUpTestUsers(dbService);
        testFundRequestID = await setUpTestTransactionRequest(service);
    });

    afterAll(async () => {
        await deleteUsers(dbService);
        await dbService.getDriver().close();
        await app.close();
    }, 7000);

    it('Run tests against DB', async () => {

        const t = new User()
        t.publicAddress = TEST_ACC_2.address
        const fundsRequest = await service.queryFundsRequestByIDAndTarget(t, testFundRequestID)

        expect(fundsRequest.id).toBe(testFundRequestID)
    });

});

async function setUpTestUsers(dbService: Neo4jService) {
    const qry = `CREATE (user1:User {feduid: $feduid1, publicAddress: $publicAddress1, privateKey: $privateKey1}), 
     (user2: User {feduid: $feduid2, publicAddress: $publicAddress2, privateKey: $privateKey2})RETURN user1, user2`;

    const rst = await dbService.write(qry, {
        feduid1: inititatorFeduid,
        publicAddress1: TEST_ACC_1.address,
        privateKey1: TEST_ACC_1.privateKey,
        feduid2: targetFeduid,
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

async function setUpTestTransactionRequest(service: RequestFundsService) {
    const tx = await service.requestFundsCypherQry(0.01, '', {
        feduid: inititatorFeduid,
        publicAddress: TEST_ACC_1.address,
        name: '',
        email: '',
        phoneNumber: '',
        idNumber: '',
        privateKey: '',
        publicKey: '',
        mnemonic: '',
        id: 0,
        labels: []
    }, {
        feduid: targetFeduid,
        publicAddress: TEST_ACC_2.address,
        name: '',
        email: '',
        phoneNumber: '',
        idNumber: '',
        privateKey: '',
        publicKey: '',
        mnemonic: '',
        id: 0,
        labels: []
    });

    return nodeToFundsRequest(tx.records[0].get('request')).id
}
