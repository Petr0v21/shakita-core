import { Field, ArgsType } from '@nestjs/graphql';

@ArgsType()
export class ActiveBonusTicketArgs {
  @Field()
  userId: string;

  @Field()
  bonusTicketId: string;
}
