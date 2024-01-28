import { Field, ArgsType } from '@nestjs/graphql';

@ArgsType()
export class RefreshArgs {
  @Field()
  token: string;
}
