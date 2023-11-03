import { Field, ObjectType } from '@nestjs/graphql';
import BaseNode from '../base-node';
import { User } from '../user/user';

/**
 * Data model for user`s.
 */
@ObjectType()
export class TransactionRequest extends BaseNode {
    /**
     * The name of the user.
     */
    @Field((type) => String, { nullable: true })
    public description!: string;

    /**
     * The users phone number.
     */
    @Field((type) => Number, { nullable: true })
    public amount!: number;

    /**
     * The users phone number.
     */
    @Field((type) => String, { nullable: true })
    public stableCoin!: string;

    /**
     * The user`s id number.
     */
    @Field((type) => String, { nullable: true })
    public network!: string;

    /**
     * The senders address.
     */
    @Field((type) => String, { nullable: true })
    public initiatorAddress: string;

    /**
     * The timestamp for the transaction.
     */
    @Field((type) => Number, { nullable: true })
    public timestamp: number;

    /**
     * The timestamp for the transaction.
    */
    @Field((type) => Boolean, { nullable: true })
    public fulfilled: boolean;

    /**
     * The account sending funds.
     */
    public sender!: User;

    /**
     * The account receiving funds.
     */
    public recipient!: User;
}

/**
 * Converts the node to a user object.
 * @param node the node from neo4j.
 */
export function nodeToTransactionRequest(node: any): TransactionRequest {
    const tx = new TransactionRequest();

    tx.labels = node.labels;
    const props = node.properties;

    tx.id = node.identity.low;
    tx.description = props.description;
    tx.amount = props.amount;
    tx.stableCoin = props.stableCoin;
    tx.network = props.network;
    tx.initiatorAddress = props.initiatorAddress;
    tx.timestamp = props.timestamp
    tx.fulfilled = props.fulfilled

    return tx;
}
