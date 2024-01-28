import { User } from 'src/user/graphql/user.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-type-json';

@ObjectType()
export class SessionType {
  @Field()
  id: string;

  @Field()
  refreshToken: string;

  @Field()
  ip: string;

  @Field(() => GraphQLJSON, { nullable: true })
  userAgent: Record<string, any>;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => User)
  user: User;
}
