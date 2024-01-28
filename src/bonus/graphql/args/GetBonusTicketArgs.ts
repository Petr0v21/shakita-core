import { Field, ArgsType } from '@nestjs/graphql';

@ArgsType()
export class GetBonusTicketArgs {
  @Field()
  code: string;
}
