import {
  MnemonicLanguages,
  MnemonicStrength,
  generateKeys,
  generateMnemonic,
  invalidMnemonicWords,
  normalizeMnemonic,
  validateMnemonic,
} from '@celo/cryptographic-utils';
import { Injectable } from '@nestjs/common';
const bip39 = require('bip39');

@Injectable()
export class CryptoWalletCreatorService {
  /**
   * The number of words to be contained in the mnemonic.
   */
  MNEMONIC_BIT_LENGTH = MnemonicStrength.s256_24words;

  /**
   * Checks if the mnemonic has duplicate words.
   */
  checkDuplicate(someString: string) {
    return new Set(someString.split(' ')).size !== someString.split(' ').length;
  }

  /**
   * Picks a the language to be used for mnemonic creation.
   */
  getMnemonicLanguage(language: string | null) {
    switch (language?.slice(0, 2)) {
      case 'es': {
        return MnemonicLanguages.spanish;
      }
      case 'pt': {
        return MnemonicLanguages.portuguese;
      }
      default: {
        return MnemonicLanguages.english;
      }
    }
  }

  /**
   * Generates a new mnemonic for account creation.
   */
  async generateNewMnemonic(): Promise<string> {
    const mnemonicLanguage = this.getMnemonicLanguage('');
    let mnemonic = await generateMnemonic(
      this.MNEMONIC_BIT_LENGTH,
      mnemonicLanguage,
      bip39,
    );

    let isDuplicateInMnemonic = this.checkDuplicate(mnemonic);
    while (isDuplicateInMnemonic) {
      mnemonic = await generateMnemonic(
        this.MNEMONIC_BIT_LENGTH,
        mnemonicLanguage,
        bip39,
      );
      isDuplicateInMnemonic = this.checkDuplicate(mnemonic);
    }

    return mnemonic;
  }

  /**
   * Checks if a mnemonic is valid or not.
   * @param phrase the mnemonic to be validated.
   * @returns true if valid
   */
  isMnemonicValid(phrase: string) {
    const normalizedPhrase = normalizeMnemonic(phrase);
    const phraseIsValid = validateMnemonic(normalizedPhrase, bip39);
    const invalidWords = phraseIsValid
      ? []
      : invalidMnemonicWords(normalizedPhrase);

    return phraseIsValid && !invalidWords;
  }

  /**
   * Creates an account given a mnemonic.
   * @param mnemonic the mnemonic string.
   */
  async getAccountFromMnemonic(mnemonic: string) {
    const keys = await generateKeys(
      mnemonic,
      undefined,
      undefined,
      undefined,
      bip39,
    );
    const accountInfo: AccountInformation = {
      mnemonic: mnemonic,
      privateKey: keys.privateKey,
      publicKey: keys.publicKey,
      address: keys.address,
    };
    return accountInfo;
  }

  /**
   * Creates a mnemonic and derives an account out of it.
   * @returns the private key.
   */
  async createNewAccountWithMnemonic() {
    const mnemonic = await this.generateNewMnemonic();
    const keys = await this.getAccountFromMnemonic(mnemonic);
    const accountInfo: AccountInformation = {
      mnemonic: mnemonic,
      privateKey: keys.privateKey,
      publicKey: keys.publicKey,
      address: keys.address,
    };
    return accountInfo;
  }
}

/**
 * Account information.
 * @typedef {Object} AccountInformation properties crypto account.
 * @property { string} mnemonic the components to be rendered on the constructed screen.
 * @property { string } privateKey the account`s private key.
 * @property { string } publicKey the account`s public key.
 * @property { string } address the account`s public address.
 */
export interface AccountInformation {
  mnemonic: string;
  privateKey: string;
  publicKey: string;
  address: string;
}
