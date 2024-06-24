import { bufferToHex, hexToBuffer } from '@celo/base';
import { Injectable } from '@nestjs/common';
import { web3 } from '../utils/block-chain-utils/contract.kit.utils';

// eslint-disable-next-line
const bip39 = require('bip39');

@Injectable()
export class CryptoWalletCreatorService {}

/**
 * Account information.
 * @typedef {Object} AccountInformation properties crypto account.
 * @property { string} mnemonic the components to be rendered on the constructed screen.
 * @property { string } privateKey the account`s private key.
 * @property { string } publicKey the account`s public key.
 * @property { string } address the account`s public address.
 */
export interface AccountInformation {
  privateKey: string;
  publicKey: string;
  address: string;
}

/**
 * Gets account information given the private key..
 * @param privateKey the private key to get account details from.
 * @returns account details for valid private keys.
 */
export function getAccountInformation(privateKey: string): AccountInformation {
  const account: AccountInformation = {
    address: undefined,
    privateKey: undefined,
    publicKey: undefined,
  };
  try {
    const acc = web3.eth.accounts.privateKeyToAccount(
      bufferToHex(hexToBuffer(privateKey))
    );
    account.address = acc.address;
    account.privateKey = acc.privateKey;
  } catch (error) {
    // console.log(error);
  }

  return account;
}
