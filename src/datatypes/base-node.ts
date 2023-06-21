/**
 * Contains data that must be present in a node.
 */
export default class BaseNode {
  /**
   * Then id of the node in the database.
   */
  public id!: Number;

  /**
   * The lables of the node in the database.
   */
  public labels!: string[];
}
