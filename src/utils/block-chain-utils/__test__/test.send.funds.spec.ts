import { StableToken } from '@celo/base';
import {
  TEST_ACC_1,
  TEST_ACC_2,
} from '../../../../test/test-utils/test.accounts';
import { getBalance } from '../account.balance.utils';
import {
  contractKit,
  initializeContractKit,
  sendFunds,
} from '../contract.kit.utils';
import { User } from '../../../datatypes/user/user';

describe('Account Balance Utils', () => {
  beforeAll(() => {
    initializeContractKit();
  });

  it('Get Wallet Balance.', async () => {
    const balance = await getBalance(TEST_ACC_2.address);
    const ttl = balance.cEUR + balance.cREAL + balance.cUSD;
    expect(ttl).toBeGreaterThan(0);
  });

  describe('Send funds.', () => {
    let senderAccount: User;
    let receipientAccount: User;

    beforeEach(async () => {
      const account1Balance = await getBalance(TEST_ACC_1.address);
      const account2Balance = await getBalance(TEST_ACC_2.address);

      if (account1Balance.cUSD > account2Balance.cUSD) {
        senderAccount = new User();
        senderAccount.publicAddress = TEST_ACC_1.address;
        senderAccount.privateKey = TEST_ACC_1.privateKey;

        receipientAccount = new User();
        receipientAccount.publicAddress = TEST_ACC_2.address;
        receipientAccount.privateKey = TEST_ACC_2.privateKey;
      } else {
        senderAccount = new User();
        senderAccount.publicAddress = TEST_ACC_2.address;
        senderAccount.privateKey = TEST_ACC_2.privateKey;

        receipientAccount = new User();
        receipientAccount.publicAddress = TEST_ACC_1.address;
        receipientAccount.privateKey = TEST_ACC_1.privateKey;
      }
    });

    it('Send cUSD', async () => {
      const receipt = await sendFunds(
        StableToken.cUSD,
        senderAccount,
        receipientAccount,
        '1000000000000',
      );
      expect(receipt.status).toBe(true);
      const accs = await contractKit.connection.getAccounts();
      expect(accs.includes(senderAccount.publicAddress)).toBe(false);
    }, 5000);

    it('Send cEUR', async () => {
      const receipt = await sendFunds(
        StableToken.cEUR,
        senderAccount,
        receipientAccount,
        '1000000000000',
      );
      expect(receipt.status).toBe(true);
      const accs = await contractKit.connection.getAccounts();
      expect(accs.includes(senderAccount.publicAddress)).toBe(false);
    }, 5000);

    // it('Send cREAL', () => {
    //     const receipt = await sendCREAL(
    //         StableToken.cEUR,
    //         senderAccount.ad,
    //         receipientAccount,
    //         '1000000000000',
    //       );
    //       expect(receipt.status).toBe(true);
    // });
  });
});
