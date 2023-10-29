import { Field, ObjectType, Int } from '@nestjs/graphql';
import { Type } from '@nestjs/common';

/**
 * Snapshot of the expected graphQL response with a list of queried objects/nodes.
 */
export interface IListResponse<T> {

    /**
     * The status code.
     */
    status: Number

    /**
     * The response message.
     */
    message: String

    /**
     * The response body/queried objects/nodes.
     */
    body: T[];

    /**
     * Total number of queries objects.
     */
    totalCount: number;

    /**
     * Tells the front end if there is an additional list of objects to be queried.
     */
    hasNextPage: boolean;
}

/**
 * Casts a list of queried objects into the expected graph QL query.
 * @param classRef the type of object espected as response.
 * @returns the casted response graph QL response.
 */
export function ListResponse<T>(classRef: Type<T>): Type<IListResponse<T>> {
    @ObjectType(`${classRef.name}Edge`)
    abstract class ListResponseType {
        @Field((type) => Int)
        status: Number;

        @Field((type) => String)
        message: String;


        @Field((type) => [classRef], { nullable: true })
        body: T[];

        @Field((type) => Int)
        totalCount: number;

        @Field()
        hasNextPage: boolean;
    }


    return ListResponseType as Type<IListResponse<T>>;
}
