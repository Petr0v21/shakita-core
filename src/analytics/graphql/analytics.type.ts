import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AnalyticsAverageType {
  @Field()
  applications: string;

  @Field()
  applications_percent?: string;

  @Field()
  users: string;

  @Field()
  users_percent?: string;
}

@ObjectType()
export class AnalyticsBasicType {
  @Field()
  applications: number;

  @Field()
  users: number;
}

@ObjectType()
export class AnalyticsWithAverageType extends AnalyticsBasicType {
  @Field()
  average: AnalyticsAverageType;
}

@ObjectType()
export class AnalyticsApplicationsType {
  @Field()
  applications_auth: number;

  @Field()
  applications_unauth: number;
}

@ObjectType()
export class AnalyticsCustomRangeType extends AnalyticsBasicType {
  @Field()
  startOfMonth: Date;

  @Field()
  endOfMonth: Date;
}

@ObjectType()
export class AnalyticsHistoryItemType {
  @Field()
  year: number;

  @Field()
  month: number;

  @Field()
  count: number;
}

@ObjectType()
export class AnalyticsHistoryType {
  @Field(() => [AnalyticsHistoryItemType])
  applications: AnalyticsHistoryItemType[];

  @Field(() => [AnalyticsHistoryItemType])
  users: AnalyticsHistoryItemType[];
}
