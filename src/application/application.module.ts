import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/graphql/user.entity';
import { ApplicationService } from './application.service';
import { Application } from './graphql/application.entity';
import { ApplicationResolver } from './graphql/application.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Application, User])],
  providers: [ApplicationService, ApplicationResolver],
  exports: [ApplicationService],
})
export class ApplicationModule {}
