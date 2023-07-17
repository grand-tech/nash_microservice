import BaseNode from '../base-node';

/**
 * Data model for user`s.
 */
export class User extends BaseNode {
  /**
   * The name of the user.
   */
  public name!: string;

  /**
   * The users federate ID from firebase.
   */
  public feduid!: string;

  /**
   * The users phone number.
   */
  public email!: string;

  /**
   * The users phone number.
   */
  public phoneNumber!: string;

  /**
   * The user`s id number.
   */
  public idNumber!: string;

  /**
   * The user`s public address on the blockchain.
   */
  public publicAddress!: string;

  /**
   * The user`s private key for blockchain transactions.
   */
  public privateKey!: string;

  /**
   * The user`s public key for blockchain encryption.
   */
  public publicKey!: string;

  /**
   * The user`s 24 word recovery phrase.
   */
  public mnemonic!: string;
}

/**
 * Converts the node to a user object.
 * @param node the node from neo4j.
 */
export function nodeToUser(node: any): User {
  const user = new User();

  user.labels = node.labels;

  const props = node.properties;

  user.id = node.identity.low;
  user.feduid = props.feduid;
  user.name = props.name;
  user.idNumber = props.idNumber;
  user.phoneNumber = props.phoneNumber;
  user.email = props.email;
  user.publicAddress = props.publicAddress;
  user.privateKey = props.privateKey;
  user.publicKey = props.publicKey;
  user.mnemonic = props.mnemonic;
  return user;
}
