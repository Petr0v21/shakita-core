import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class ListArgs {
  @Field({ nullable: true, defaultValue: 0 })
  skip?: number;

  @Field({ nullable: true, defaultValue: 15 })
  take?: number;
}
