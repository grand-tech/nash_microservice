import { Type } from '@nestjs/common';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from '../datatypes/user/user';

/**
 * Response object interface.
 */
export interface IResponse<T> {

  /**
   * The status code of the API proccess.
   */
  status: Number;

  /**
   * The expected response message.
   */
  message: String;

  /**
   * The expected response object type.
   */
  body: T;
};

/**
 * Casts the response object to a graph QL response type.
 * @param classRef type of object expected as response.
 * @returns the response object.
 */
export function Response<T>(classRef: Type<T>): Type<IResponse<T>> {
  @ObjectType(`${classRef.name}Response`)
  abstract class ResponseType {
    @Field((type) => Int)
    status: Number;

    @Field((type) => String)
    message: String;


    @Field((type) => classRef, { nullable: true })
    body: T;
  }

  return ResponseType as Type<IResponse<T>>;
}

// List of all the expected response objects in the project.
@ObjectType()
export class UserResponse extends Response(User!) { }