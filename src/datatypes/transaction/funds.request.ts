import { Field, ObjectType } from '@nestjs/graphql';
import BaseNode from '../base-node';
import { User } from '../user/user';

/**
 * Data model for user`s.
 */
@ObjectType()
export class FundsRequest extends BaseNode {
  /**
   * The name of the user.
   */
  @Field(type => String, { nullable: true })
  public description!: string;

  /**
   * The users phone number.
   */
  @Field(type => Number, { nullable: true })
  public amount!: number;

  /**
   * The users phone number.
   */
  @Field(type => String, { nullable: true })
  public stableCoin!: string;

  /**
   * The user`s id number.
   */
  @Field(type => String, { nullable: true })
  public network!: string;

  /**
   * The senders address.
   */
  @Field(type => String, { nullable: true })
  public initiatorAddress: string;

  /**
   * The timestamp for the transaction.
   */
  @Field(type => Number, { nullable: true })
  public timestamp: number;

  /**
   * The timestamp for the transaction.
   */
  @Field(type => Boolean, { nullable: true })
  public fulfilled: boolean;

  /**
   * The transaction request target.
   */
  public target!: User;

  /**
   * The transaction request initiator.
   */
  public initiator!: User;
}

/**
 * Converts the node to a user object.
 * @param node the node from neo4j.
 */
export function nodeToFundsRequest(node: any): FundsRequest {
  const tx = new FundsRequest();

  tx.labels = node.labels;
  const props = node.properties;

  tx.id = node.identity.low;
  tx.description = props.description;
  tx.amount = props.amount;
  tx.stableCoin = props.stableCoin;
  tx.network = props.network;
  tx.initiatorAddress = props.initiatorAddress;
  tx.timestamp = props.timestamp;
  tx.fulfilled = props.fulfilled;

  return tx;
}
