import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Application } from 'src/application/graphql/application.entity';
import { ApplicationStatus } from 'src/application/graphql/application.enum';

@Injectable()
export class ShedulesService {
  constructor(
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
    private mailerService: MailerService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async sendMailBeforTimeApplication() {
    //TODO add custom timezone
    const timeNow = new Date(new Date().getHours() + 2);
    const time_from = new Date(new Date().setHours(timeNow.getHours() + 1));
    const time_to = new Date(
      new Date(new Date().setHours(time_from.getHours() + 1)).setMilliseconds(
        -1,
      ),
    );
    const applications = await this.applicationRepository.findBy({
      date: Between(time_from, time_to),
      status: ApplicationStatus.APPROVED,
    });
    //TODO
    applications.forEach((application) => {
      this.mailerService.sendMail({
        to: application.user.email,
        subject: 'Your application time after one hour',
        text: 'Test',
      });
    });
  }
}
