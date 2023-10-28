import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Response<T> {
  @Field(type => String, { nullable: true })
  status: Number;

  @Field(type => String, { nullable: true })
  message: String;

  @Field({ nullable: true })
  body: T;
};
