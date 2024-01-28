import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/graphql/user.entity';
import { Application } from 'src/application/graphql/application.entity';
import { AnalyticsService } from './analytics.service';
import { AnalyticsResolver } from './graphql/analytics.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Application, User])],
  providers: [AnalyticsService, AnalyticsResolver],
})
export class AnalyticsModule {}
