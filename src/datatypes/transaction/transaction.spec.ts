import { Transaction, nodeToTransaction } from './transaction';

describe('Transaction', () => {
    it('should be defined', () => {
        expect(new Transaction()).toBeDefined();
    });
});

describe('Node to transaction', () => {
    it('Should replicate fields on User object.', () => {
        const transactionNode = {
            labels: ['Transaction'],
            properties: {
                description: 'School Fees',
                transactionCode: '232323',
                amount: 1.2,
                stableCoin: 'cUSD',
                network: 'CELO',
                blockchainTransactionHash: '1234567891',
                blockchainTransactionIndex: '1234567892',
                transactionBlockHash: '1234567893',
                blockchainTransactionStatus: true,
                senderAddress: '1234567894',
                timestamp: 1234567891,
            },
            identity: {
                low: 10,
                high: 0,
            },
        };

        const transaction = nodeToTransaction(transactionNode);

        // Assertions.
        expect(transaction).toBeDefined();
        expect(transaction.id).toBe(10);
        expect(transaction.description).toBe('School Fees');
        expect(transaction.transactionCode).toBe('232323');
        expect(transaction.amount).toBe(1.2);
        expect(transaction.stableCoin).toBe('cUSD');
        expect(transaction.network).toBe('CELO');
        expect(transaction.blockchainTransactionHash).toBe('1234567891');
        expect(transaction.blockchainTransactionIndex).toBe('1234567892');
        expect(transaction.transactionBlockHash).toBe('1234567893');
        expect(transaction.blockchainTransactionStatus).toBe(true);
        expect(transaction.senderAddress).toBe('1234567894');
        expect(transaction.timestamp).toBe(1234567891);


        expect(transaction.labels).toEqual(['Transaction']);
    });
});
