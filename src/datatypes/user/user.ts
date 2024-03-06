import { Field, ObjectType } from '@nestjs/graphql';
import BaseNode from '../base-node';

/**
 * Data model for user`s.
 */
@ObjectType()
export class User extends BaseNode {
  /**
   * The name of the user.
   */
  @Field(type => String, { nullable: true })
  public name!: string;

  /**
   * The users federate ID from firebase.
   */
  @Field(type => String, { nullable: true })
  public feduid!: string;

  /**
   * The users phone number.
   */
  @Field(type => String, { nullable: true })
  public email!: string;

  /**
   * The users phone number.
   */
  @Field(type => String, { nullable: true })
  public phoneNumber!: string;

  /**
   * The user`s id number.
   */
  @Field(type => String, { nullable: true })
  public idNumber!: string;

  /**
   * The user`s public address on the blockchain.
   */
  @Field(type => String, { nullable: true })
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
