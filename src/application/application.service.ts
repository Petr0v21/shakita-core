import { Injectable } from '@nestjs/common';
import { Application } from './graphql/application.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { CreateOneApplicationArgs } from './graphql/args/CreateOneApplicationArgs';
import { User } from 'src/user/graphql/user.entity';
import { UpdateOneApplicationArgs } from './graphql/args/UpdateOneApplicationArgs';
import { ApplicationStatus } from './graphql/application.enum';
import { GetApplicationsArgs } from './graphql/args/GetApplicationsArgs';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
    @InjectRepository(User)
    private userRepository: Repository<User>,

    private mailerService: MailerService,
  ) {}

  getRange(date: Date) {
    const date_to = new Date(date.toISOString());
    const date_from = new Date(date.toISOString());
    date_from.setHours(date.getHours() - 1);
    date_from.setMilliseconds(-1);
    date_to.setHours(date.getHours() + 2);
    date_to.setMilliseconds(-1);
    return { date_from, date_to };
  }

  async find(args: GetApplicationsArgs) {
    try {
      if (args.date_from && !args.date_to) {
        args.date_to = new Date(
          new Date(
            new Date(args.date_from).setHours(args.date_from.getHours() + 2),
          ).setMilliseconds(-1),
        );
      }
      let filter = [];
      if (args.id) {
        filter = [
          {
            id: args.id,
          },
        ];
      } else {
        filter = [
          {
            date: args.date_from ? Between(args.date_from, args.date_to) : null,
            status: args.status ?? null,
            place: args.place ?? null,
          },
        ];
      }
      console.log(args, filter);
      if (!Object.entries(filter[0]).find((item) => !!item[1])) {
        filter = [];
      }
      return await this.applicationRepository.find({
        where: filter,
        order: {
          date: 'ASC',
        },
        skip: args.skip ?? 0,
        take: args.take ?? 15,
      });
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  async findByDateAndHours(
    date: Date,
    status: ApplicationStatus = ApplicationStatus.APPROVED,
  ) {
    const { date_from, date_to } = this.getRange(date);
    return await this.applicationRepository.find({
      where: {
        date: Between(date_from, date_to),
        status: status,
      },
    });
  }

  async findById(id: string) {
    return await this.applicationRepository.findOne({
      where: {
        id,
      },
      relations: ['user'],
    });
  }

  async getApplicationHistory(email: string) {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
      relations: ['applications'],
    });
    return user ? user.applications : [];
  }

  async create(args: CreateOneApplicationArgs) {
    let user = await this.userRepository.findOneBy({
      email: args.email,
    });
    if (!user) {
      user = null;
    }

    console.log('user apl', user);
    if (args.enable_notification) {
      await this.mailerService.sendMail({
        to: args.email,
        subject: 'Created Application' + args.name,
        text: 'Application pending' + args.date + args.description,
      });
    }
    console.log('Application name', args.name);
    console.log({
      ...args,
      user: user,
    });

    return await this.applicationRepository.save({
      ...args,
      user: user,
    });
  }

  async delete(id: string) {
    return await this.applicationRepository.delete(id);
  }

  async update(args: UpdateOneApplicationArgs) {
    const { id, ...updateArgs } = args;

    const application = await this.applicationRepository.findOne({
      where: {
        id,
      },
      relations: ['user'],
    });
    if (application.user && application.user.enable_notifications) {
      this.mailerService.sendMail({
        to: application.user.email,
        subject: 'Change Application',
        text: `Application ${
          updateArgs.status ?? application.status
        } at place: ${updateArgs.place ?? application.place} on time ${
          updateArgs.date ?? application.date
        } `,
      });
    }

    return await this.applicationRepository.update(id, updateArgs);
  }

  async addUserToApplications(user: User) {
    const applications = await this.applicationRepository.find({
      where: {
        email: user.email,
      },
    });
    return await Promise.all(
      applications.map(async ({ id }) => {
        return await this.applicationRepository.update(id, { user: user });
      }),
    );
  }
}
