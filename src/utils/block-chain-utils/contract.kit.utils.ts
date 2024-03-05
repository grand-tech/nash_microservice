import { ContractKit, newKitFromWeb3, StableToken } from '@celo/contractkit';
import Web3 from 'web3';
import { CeloTxReceipt } from '@celo/connect';
import { User } from '../../datatypes/user/user';

export let web3: Web3;

export let contractKit: ContractKit;

/**
 * Initialize contract kit.
 */
export function initializeContractKit() {
  if (!web3) {
    web3 = new Web3('https://alfajores-forno.celo-testnet.org');
  }

  if (!contractKit) {
    contractKit = newKitFromWeb3(web3);
  }
}

/**
 * Dismantles the contract kit instance.
 */
export function dismantleContractKit() {
  web3 = undefined;
  contractKit = undefined;
}

/**
 * Send funds to a specific account.
 * @param token the token used for the transaction.
 * @param senderAccount the senders account information.
 * @param recipientAccount the receipient account information.
 */
export async function sendFunds(
  token: StableToken,
  senderAccount: User,
  recipientAccount: User,
  amount: number
) {
  // prepare for transaction.
  contractKit.connection.addAccount(senderAccount.privateKey);
  const amountWei = contractKit.web3.utils.toWei(amount.toString());

  // perform transaction.
  let txReceipt: CeloTxReceipt;
  if (token == StableToken.cUSD) {
    txReceipt = await sendCUSD(
      senderAccount.publicAddress,
      recipientAccount.publicAddress,
      amountWei
    );
  } else {
    txReceipt = await sendCEUR(
      senderAccount.publicAddress,
      recipientAccount.publicAddress,
      amountWei
    );
  }

  // clean up after transaction.
  contractKit.connection.removeAccount(senderAccount.publicAddress);

  return txReceipt;
}

/**
 * Sends a certain amount of cUSD to a specified address.
 * @param senderAddress the senders address.
 * @param recipientAddress the address receiving the funds
 * @param amount the number of tokens to be sent in wei.
 * @returns the transaction receipt.
 */
export async function sendCUSD(
  senderAddress: string,
  recipientAddress: string,
  amount: string
) {
  const cUSDToken = await contractKit.contracts.getStableToken(
    StableToken.cUSD
  );
  const cUSDtx = await cUSDToken
    ?.transfer(recipientAddress, amount)
    .sendAndWaitForReceipt({
      from: senderAddress,
      feeCurrency: cUSDToken?.address,
    });
  return cUSDtx;
}

/**
 * Sends a certain amount of cEUR to a specified address.
 * @param senderAddress the senders address.
 * @param recipientAddress the address receiving the funds
 * @param amount the number of tokens to be sent in wei.
 * @returns the transaction receipt.
 */
export async function sendCEUR(
  senderAddress: string,
  recipientAddress: string,
  amount: string
): Promise<CeloTxReceipt> {
  const cEURToken = await contractKit.contracts.getStableToken(
    StableToken.cEUR
  );
  const cUSDtx = await cEURToken
    ?.transfer(recipientAddress, amount)
    .sendAndWaitForReceipt({
      from: senderAddress,
      feeCurrency: cEURToken?.address,
    });
  return cUSDtx;
}
