import { Args, Query, Resolver } from '@nestjs/graphql';
import { AnalyticsService } from '../analytics.service';
import {
  AnalyticsApplicationsType,
  AnalyticsBasicType,
  AnalyticsCustomRangeType,
  AnalyticsHistoryType,
  AnalyticsWithAverageType,
} from './analytics.type';
import {
  AnalyticsHistoryArgs,
  AnalyticsRangeArgs,
  AnalyticsRangeOptionalArgs,
} from './args/AnalyticsArgs';

@Resolver(() => AnalyticsBasicType)
export class AnalyticsResolver {
  constructor(private analyticsService: AnalyticsService) {}

  @Query(() => AnalyticsWithAverageType)
  async getActualData(): Promise<AnalyticsWithAverageType> {
    return await this.analyticsService.getActualData();
  }

  @Query(() => AnalyticsWithAverageType)
  async getAllData(): Promise<AnalyticsWithAverageType> {
    return await this.analyticsService.getAllData();
  }

  @Query(() => AnalyticsApplicationsType)
  async getCorrelationApplicationsData(
    @Args() args: AnalyticsRangeOptionalArgs,
  ): Promise<AnalyticsApplicationsType> {
    return await this.analyticsService.getCorrelationApplicationsData(args);
  }

  @Query(() => AnalyticsCustomRangeType)
  async getCustomData(
    @Args() args: AnalyticsRangeArgs,
  ): Promise<AnalyticsCustomRangeType> {
    return await this.analyticsService.getCustomData(args);
  }

  @Query(() => AnalyticsHistoryType)
  async getHistoryData(
    @Args() args: AnalyticsHistoryArgs,
  ): Promise<AnalyticsHistoryType> {
    return await this.analyticsService.getHistoryData(args);
  }
}
