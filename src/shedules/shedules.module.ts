import { Module } from '@nestjs/common';
import { ShedulesService } from './shedule.service';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from 'src/application/graphql/application.entity';

@Module({
  imports: [ScheduleModule.forRoot(), TypeOrmModule.forFeature([Application])],
  providers: [ShedulesService],
  exports: [ShedulesService],
})
export class ShedulesModule {}
