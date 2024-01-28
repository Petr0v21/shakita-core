import { Field, ArgsType } from '@nestjs/graphql';

@ArgsType()
export class AnalyticsRangeArgs {
  @Field()
  startOfMonth: Date;

  @Field()
  endOfMonth: Date;
}

@ArgsType()
export class AnalyticsHistoryArgs {
  @Field({ nullable: true })
  fillEmptyMonth?: boolean;

  @Field({ nullable: true })
  startOf?: Date;

  @Field({ nullable: true })
  endOf?: Date;
}

@ArgsType()
export class AnalyticsRangeOptionalArgs {
  @Field({ nullable: true })
  startOf?: Date;

  @Field({ nullable: true })
  endOf?: Date;
}
