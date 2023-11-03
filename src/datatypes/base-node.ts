import { Field, Int } from '@nestjs/graphql';

/**
 * Contains data that must be present in a node.
 */
export default class BaseNode {
  /**
   * Then id of the node in the database.
   */
  @Field((type) => Int, { nullable: true })
  public id!: number;

  /**
   * The lables of the node in the database.
   */
  @Field((type) => [String], { nullable: true })
  public labels!: string[];
}
