import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { nodeToUser, User } from '../datatypes/user/user';
import { Response } from 'src/utils/response';
import {
  AccountInformation,
  CryptoWalletCreatorService,
  getAccountInformation,
} from './crypto-wallet-creator/crypto-wallet-creator.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly neo4j: Neo4jService,
    private readonly walletCreator: CryptoWalletCreatorService,
  ) {}

  /**
   * Queries for user information given their feduidd.
   * @param feduid the user`s feduid.
   * @return the queried user.
   */
  async getUser(feduid: string) {
    const rst = await this.neo4j.read(
      'MATCH (user:User) WHERE user.feduid = $feduid RETURN user',
      { feduid: feduid },
    );

    if (rst.records.length > 0) {
      const usr = rst.records[0].get('user');
      return nodeToUser(usr);
    } else {
      return new User();
    }
  }

  /**
   * Queries for user information given their feduidd.
   * @param feduid the user`s feduid.
   * @return the queried user.
   */
  async getUserByPublicAddress(publicAddress: string) {
    const rst = await this.neo4j.read(
      'MATCH (user:User) WHERE user.publicAddress = $publicAddress RETURN user',
      { publicAddress: publicAddress },
    );

    if (rst.records.length > 0) {
      const usr = rst.records[0].get('user');
      return nodeToUser(usr);
    } else {
      return new User();
    }
  }

  /**
   * Queries for user information given their feduidd.
   * @param feduid the user`s feduid.
   * @return the queried user.
   */
  async createUserQuery(user: User) {
    const params: Record<string, any> = {
      feduid: user.feduid,
    };

    const rst = await this.neo4j.write(
      'CREATE (user:User { feduid: $feduid}) RETURN user',
      params,
    );

    if (rst.records.length > 0) {
      const usr = rst.records[0].get('user');
      return nodeToUser(usr);
    } else {
      return new User();
    }
  }

  /**
   * Creates a user with a customer role.
   * @param user the user information.
   * @returns a proimise of the created record.
   */
  async createUser(user: User): Promise<User> {
    user.feduid = user.feduid.trim();
    if (user.feduid != '') {
      const usr = await this.getUser(user.feduid);
      if (usr.feduid) {
        return usr;
      } else {
        return await this.createUserQuery(user);
      }
    } else {
      return new User();
    }
  }

  /**
   * Validates a new user.
   * @param user the new users information.
   * @returns the user record created in the database.
   */
  async validateNewUser(user: User): Promise<Response> {
    const response: Response = {
      status: 200,
      message: 'Success',
      body: undefined,
    };

    if (typeof user.feduid == 'undefined' || user.feduid == '') {
      response.status = 500;
      response.message = 'Invalid session key!!';
    } else {
      const usr = await this.createUser(user);

      if (usr?.id?.valueOf() ?? 0 > 0) {
        response.body = usr;
      } else {
        response.status = 501;
        response.message = 'Error signing up to system.';
      }
    }

    return response;
  }

  /**
   * Creates a crypto wallet for the user.
   * @param user the new user without a crypto wallet.
   * @returns returns the response with the account details.
   */
  async createCryptoAccount(user: User): Promise<Response> {
    const rsp: Response = {
      status: 200,
      message: 'Success',
      body: {},
    };

    rsp.body = user;

    if (typeof user.privateKey == 'undefined' || user.privateKey.trim() == '') {
      const wallet = await this.walletCreator.createNewAccountWithMnemonic();

      user.publicAddress = wallet.address;
      user.privateKey = wallet.privateKey;
      user.mnemonic = wallet.mnemonic;
      user.publicKey = wallet.publicKey;

      const u = await this.saveCryptoWalletDetails(user);
      if (u.feduid != user.feduid) {
        rsp.message = 'Error creating crypto wallet.';
        rsp.status = 401;
      } else {
        rsp.body = u;
      }
    }

    return rsp;
  }

  /**
   * Save the crypto wallet details.
   * @param user the user with the unsaved crypto wallet.
   * @returns the saved user crypto wallet.
   */
  async saveCryptoWalletDetails(user: User) {
    const params: Record<string, string> = {
      feduid: user.feduid,
      privateKey: user.privateKey,
      publicAddress: user.publicAddress,
      mnemonic: user.mnemonic,
      publicKey: user.publicKey,
    };

    const rst = await this.neo4j.write(
      'MATCH (user:User { feduid: $feduid}) ' +
        ' SET user.privateKey = $privateKey, user.mnemonic = $mnemonic, ' +
        ' user.publicAddress = $publicAddress, user.publicKey = $publicKey' +
        ' RETURN user',
      params,
    );

    if (rst.records.length > 0) {
      const usr = rst.records[0].get('user');
      return nodeToUser(usr);
    } else {
      return new User();
    }
  }

  /**
   * Adds a private key to the users account.
   * @param feduid the users feduid.
   * @param privateKey the users private key.
   */
  async addPrivateKeyToAccount(
    user: User,
    privateKey: string,
  ): Promise<Response> {
    if ((user.privateKey ?? '') != '') {
      return {
        message: 'Account alreay has a private key!!',
        status: 501,
        body: undefined,
      };
    }

    const web3Acc = getAccountInformation(privateKey);
    return await this.validateExistingCryptoAccount(user.feduid, web3Acc);
  }

  /**
   * Adds a private key to the users account.
   * @param feduid the users feduid.
   * @param mnemonic the users private mnemonic.
   */
  async addMnemonicToAccount(user: User, mnemonic: string): Promise<Response> {
    if ((user?.privateKey ?? '').trim() != '') {
      return {
        message: 'Account alreay has a private key!!',
        status: 501,
        body: undefined,
      };
    }

    const acc = await this.walletCreator.getAccountFromMnemonic(mnemonic);
    return await this.validateExistingCryptoAccount(user.feduid, acc);
  }

  /**
   * Validates an existing crypto wallet before saving it to an account.
   * @param feduid the users feduid.
   * @param acc the web3 account information to be saved.
   */
  async validateExistingCryptoAccount(
    feduid: string,
    acc: AccountInformation,
  ): Promise<Response> {
    const rsp: Response = {
      status: 200,
      message: 'Success',
      body: undefined,
    };

    if ((acc?.address ?? '') === '') {
      rsp.message = 'Invalid private key or mnemonic(seed phrase)!!';
      rsp.status = 502;
    } else {
      const usr = await this.getUserByPublicAddress(acc.address);

      if ((usr.id ?? -1) >= 0) {
        rsp.message = 'Private key is already in use by another account!!';
        rsp.status = 503;
      } else {
        const u = new User();
        u.feduid = feduid;
        this.composeAddWeb3AccQryParams(u, acc);
        const savedUser = await this.saveCryptoWalletDetails(u);

        if (savedUser.feduid == feduid) {
          // user has been properly saved.
          rsp.body = savedUser;
        } else {
          rsp.message = 'Error saving crypto account!!';
          rsp.status = 504;
        }
      }
    }
    return rsp;
  }

  /**
   * Componse add web3 account query params.
   * @param user the user account in question.
   * @param acc the web3 details to be updated.
   */
  composeAddWeb3AccQryParams(user: User, acc: AccountInformation) {
    user.privateKey = acc.privateKey;
    user.publicAddress = acc.address;
    user.publicKey = acc.publicKey ?? '';
    user.mnemonic = acc.mnemonic ?? '';
  }
}
