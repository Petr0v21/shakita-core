import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Not, IsNull } from 'typeorm';
import { Application } from 'src/application/graphql/application.entity';
import { User } from 'src/user/graphql/user.entity';
import {
  AnalyticsBasicType,
  AnalyticsCustomRangeType,
} from './graphql/analytics.type';
import {
  AnalyticsHistoryArgs,
  AnalyticsRangeOptionalArgs,
} from './graphql/args/AnalyticsArgs';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  private getAmountMonth(startDate: Date) {
    return (
      (new Date().getFullYear() - startDate.getFullYear()) * 12 +
      (new Date().getMonth() - startDate.getMonth())
    );
  }

  private fillMissingMonths(
    data: { year: number; month: number; count: number }[],
  ): { year: number; month: number; count: number }[] {
    const curentDate = {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      count: 0,
    };
    if (
      curentDate.year !== data[data.length - 1].year ||
      curentDate.month !== data[data.length - 1].month
    ) {
      data.push(curentDate);
    }
    const filledData = [];

    for (let year = data[0].year; year <= data[data.length - 1].year; year++) {
      const startYear = year === data[0].year;
      const endYear = year === data[data.length - 1].year;

      for (
        let month = startYear ? data[0].month : 1;
        endYear ? month <= data[data.length - 1].month : month <= 12;
        month++
      ) {
        const existingRecord = data.find(
          (record) => record.year === year && record.month === month,
        );
        filledData.push(existingRecord || { year, month, count: 0 });
      }
    }

    return filledData;
  }

  private getPercent = (previous: number, current: number): string => {
    if (previous === 0) {
      if (current === 0) {
        return '0';
      }
      return '100';
    }
    return ((current * 100) / previous - 100).toFixed(2);
  };

  async getAmounts(filter?: any): Promise<AnalyticsBasicType> {
    return {
      applications: await this.applicationRepository.count(filter),
      //   applications_auth: await this.applicationRepository.count(filter),
      users: await this.userRepository.count(filter),
    };
  }

  async getRecordsByMonthAnalytics(
    yourEntityRepository: Repository<any>,
    withFill?: boolean,
    filter?:
      | {
          query: string;
          parameters?: any;
        }
      | undefined,
  ): Promise<{ month: number; count: number; year: number }[]> {
    const result = await yourEntityRepository
      .createQueryBuilder('your_entity')
      .select('EXTRACT(YEAR FROM "your_entity"."createdAt") as year')
      .addSelect('EXTRACT(MONTH FROM "your_entity"."createdAt") as month')
      .addSelect('COUNT(*) as count')
      .where(
        filter?.query ?? '"your_entity"."createdAt" IS NOT NULL',
        filter.parameters,
      )
      .groupBy(
        'EXTRACT(YEAR FROM "your_entity"."createdAt"), EXTRACT(MONTH FROM "your_entity"."createdAt")',
      )
      .orderBy('year', 'ASC')
      .addOrderBy('month', 'ASC')
      .getRawMany();

    if (withFill) {
      return this.fillMissingMonths(result).map(({ year, month, count }) => ({
        year: +year,
        month: +month,
        count: count || 0,
      }));
    }

    return result.map(({ year, month, count }) => ({
      year: +year,
      month: +month,
      count: count || 0,
    }));
  }

  async getActualData() {
    try {
      const currentDate = new Date();
      const rangeDate = {
        startOfMonth: new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          1,
        ),
        endOfMonth: new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          0,
          23,
          59,
          59,
          999,
        ),
      };
      const previousAmounts = await this.getAmounts({
        where: {
          createdAt: Between(
            new Date(
              new Date(rangeDate.startOfMonth).setMonth(
                rangeDate.startOfMonth.getMonth() - 1,
              ),
            ),
            new Date(
              new Date(rangeDate.endOfMonth).setMonth(
                new Date().getMonth() - 1,
              ),
            ),
          ),
        },
      });
      const currentAmounts = await this.getAmounts({
        where: {
          createdAt: Between(rangeDate.startOfMonth, rangeDate.endOfMonth),
        },
      });
      return {
        ...currentAmounts,
        average: {
          applications: `${currentAmounts.applications}/${previousAmounts.applications}`,
          applications_percent: this.getPercent(
            previousAmounts.applications,
            currentAmounts.applications,
          ),
          users: `${currentAmounts.users}/${previousAmounts.users}`,
          users_percent: this.getPercent(
            previousAmounts.users,
            currentAmounts.users,
          ),
        },
      };
    } catch (err) {
      throw err;
    }
  }

  async getCustomData(rangeDate: {
    startOfMonth: Date;
    endOfMonth: Date;
  }): Promise<AnalyticsCustomRangeType> {
    try {
      const result = await this.getAmounts({
        where: {
          createdAt: Between(rangeDate.startOfMonth, rangeDate.endOfMonth),
        },
      });
      return {
        ...result,
        ...rangeDate,
      };
    } catch (err) {
      throw err;
    }
  }

  async getAllData() {
    try {
      const result = await this.getAmounts();
      const firstApplication = (
        await this.applicationRepository.find({
          skip: 0,
          take: 1,
          order: { createdAt: 'ASC' },
        })
      )[0];
      const firstUser = (
        await this.userRepository.find({
          skip: 0,
          take: 1,
          order: { createdAt: 'ASC' },
        })
      )[0];

      return {
        ...result,
        average: {
          users: (
            result.users / this.getAmountMonth(firstUser.createdAt)
          ).toFixed(2),
          applications: (
            result.applications /
            this.getAmountMonth(firstApplication.createdAt)
          ).toFixed(2),
        },
      };
    } catch (err) {
      throw err;
    }
  }

  async getHistoryData(args: AnalyticsHistoryArgs) {
    try {
      const filter = {
        query: '',
        parameters: undefined,
      };
      const currentDate = new Date();
      const rangeDate = {
        startOfMonth: new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() - 11,
          1,
        ),
        endOfMonth: new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          0,
          23,
          59,
          59,
          999,
        ),
      };
      filter.query += '"your_entity"."createdAt" >= :startDate';
      if (args.startOf) {
        filter.parameters = { ...filter.parameters, startDate: args.startOf };
      } else {
        filter.parameters = {
          ...filter.parameters,
          startDate: rangeDate.startOfMonth,
        };
      }

      if (args.endOf) {
        filter.query += '"your_entity"."createdAt" <= :endDate';
        filter.parameters = { ...filter.parameters, endDate: args.endOf };
      } else {
        filter.parameters = {
          ...filter.parameters,
          endDate: rangeDate.endOfMonth,
        };
      }
      return {
        applications: await this.getRecordsByMonthAnalytics(
          this.applicationRepository,
          args.fillEmptyMonth,
          filter,
        ),
        users: await this.getRecordsByMonthAnalytics(
          this.userRepository,
          args.fillEmptyMonth,
          filter,
        ),
      };
    } catch (err) {
      throw err;
    }
  }

  async getCorrelationApplicationsData(args: AnalyticsRangeOptionalArgs) {
    try {
      return {
        applications_auth: await this.applicationRepository.count({
          where: {
            user: Not(IsNull()),
            createdAt:
              args.endOf && args.startOf
                ? Between(args.startOf, args.endOf)
                : null,
          },
        }),
        applications_unauth: await this.applicationRepository.count({
          where: {
            user: IsNull(),
            createdAt:
              args.endOf && args.startOf
                ? Between(args.startOf, args.endOf)
                : null,
          },
        }),
      };
    } catch (err) {
      throw err;
    }
  }
}
