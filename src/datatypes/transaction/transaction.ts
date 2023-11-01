import { Field, ObjectType } from '@nestjs/graphql';
import BaseNode from '../base-node';
import { User } from '../user/user';

/**
 * Data model for user`s.
 */
@ObjectType()
export class Transaction extends BaseNode {
    /**
     * The name of the user.
     */
    @Field(type => String, { nullable: true })
    public description!: string;

    /**
     * The users federate ID from firebase.
     */
    @Field(type => String, { nullable: true })
    public transactionCode!: string;

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
     * The user`s public address on the blockchain.
     */
    @Field(type => String, { nullable: true })
    public blockchainTransactionHash!: string;

    /**
     * The transaction index on the blockchain.
     */
    @Field(type => Number, { nullable: true })
    public blockchainTransactionIndex!: number

    /**
     * The transaction block hash.
     */
    @Field(type => String, { nullable: true })
    public transactionBlockHash!: string

    /**
     * The blockchain transaction status.
     */
    @Field(type => Boolean, { nullable: true })
    public blockchainTransactionStatus!: boolean

    /**
     * A snapshot of when the transaction happened.
     */
    @Field(type => Number, { nullable: true })
    public transactionTimestamp!: number

    /**
     * The senders address.
     */
    @Field(type => String, { nullable: true })
    public senderAddress: string

    /**
     * The timestamp for the transaction.
     */
    @Field(type => Number, { nullable: true })
    public timestamp: number

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
export function nodeToTransaction(node: any): Transaction {
    const tx = new Transaction();

    tx.labels = node.labels;
    const props = node.properties;

    tx.id = node.identity.low;
    tx.description = props.description;
    tx.transactionCode = props.transactionCode;
    tx.amount = props.amount;
    tx.stableCoin = props.stableCoin;
    tx.network = props.network;
    tx.blockchainTransactionHash = props.blockchainTransactionHash;
    tx.blockchainTransactionIndex = props.blockchainTransactionIndex;
    tx.transactionBlockHash = props.transactionBlockHash;
    tx.blockchainTransactionStatus = props.blockchainTransactionStatus;
    tx.transactionTimestamp = props.transactionTimestamp;
    tx.senderAddress = props.senderAddress

    return tx;
}
