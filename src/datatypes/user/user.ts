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
   * The user`s id number.
   */
  public idNumber!: string;

  /**
   * The user`s public address on the blockchain.
   */
  public publicAddress!: string;

  /**
   * The users phone number.
   */
  public phoneNumber!: string;
}

/**
 * Converts the node to a user object.
 * @param node the node from neo4j.
 */
export function nodeToUser(node: any): User {
  const user = new User();

  user.labels = node.labels;

  const props = node.properties;

  user.feduid = props.feduid;
  user.name = props.name;
  user.idNumber = props.idNumber;
  user.phoneNumber = props.phoneNumber;
  user.publicAddress = props.publicAddress;

  return user;
}
