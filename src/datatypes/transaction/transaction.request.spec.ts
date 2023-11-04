import { FundsRequest, nodeToFundsRequest } from "./funds.request";

describe('TransactionRequest', () => {
    it('should be defined', () => {
        expect(new FundsRequest()).toBeDefined();
    });
});

describe('Node to transaction request.', () => {
    it('Should replicate fields on Transaction Request object.', () => {
        const transactionRequestNode = {
            labels: ['TransactionRequest'],
            properties: {
                description: 'School Fees.',
                amount: 1.2,
                stableCoin: 'cUSD',
                network: 'CELO',
                initiatorAddress: '123456789',
                timestamp: 123456789,
                fulfilled: false,
            },
            identity: {
                low: 10,
                high: 0,
            },
        };

        const transaction = nodeToFundsRequest(transactionRequestNode);

        // Assertions.
        expect(transaction).toBeDefined();
        expect(transaction.id).toBe(10);
        expect(transaction.description).toBe('School Fees.');
        expect(transaction.amount).toBe(1.2);
        expect(transaction.stableCoin).toBe('cUSD');
        expect(transaction.network).toBe('CELO');
        expect(transaction.initiatorAddress).toBe('123456789');
        expect(transaction.timestamp).toBe(123456789);
        expect(transaction.fulfilled).toBe(false);


        expect(transaction.labels).toEqual(['TransactionRequest']);
    });
});
