import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { AuthCode } from './graphql/authcode.entity';
import { User } from '../user/graphql/user.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthCodeService {
  constructor(
    private mailerService: MailerService,
    private readonly userService: UserService,

    @InjectRepository(AuthCode)
    private authCodeRepository: Repository<AuthCode>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(args: any) {
    const user = await this.userRepository.findOne({
      where: {
        email: args.email,
      },
    });
    if (user) {
      await this.authCodeRepository.update(
        {
          email: args.email,
        },
        {
          status_active: false,
        },
      );
      const date = new Date(new Date().toISOString());
      const deadAt = new Date(new Date(date).setMinutes(date.getMinutes() + 5));
      await this.authCodeRepository.save({ ...args, deadAt, user });
      await this.mailerService.sendMail({
        to: args.email,
        subject: 'Your auth code',
        text: `Test ${args.code}`,
      });
      return { success: true };
    }
    return { success: false };
  }

  async find(code: string, email: string) {
    return await this.authCodeRepository.findOne({
      where: {
        code,
        email,
        status_active: true,
        deadAt: MoreThanOrEqual(new Date()),
      },
      relations: ['user'],
    });
  }

  async update(args: any) {
    const { id, ...data } = args;
    return await this.authCodeRepository.update(id, {
      ...data,
    });
  }

  generateCode() {
    return (Math.random() + 1).toString(36).substring(7);
  }

  async codeCreateAndCheckEmail(email: string) {
    return await this.create({
      email,
      code: this.generateCode(),
    });
  }

  async codeCheck(code: string, email: string) {
    const result = await this.find(code, email);
    return { success: !!result };
  }

  async resetPassword(code: string, email: string, password: string) {
    const checkStatus = await this.find(code, email);
    if (checkStatus) {
      const result = await this.userService.update(checkStatus.user.id, {
        password,
      });
      await this.update({
        id: checkStatus.id,
        status_active: false,
      });
      return { success: !!result };
    }
    return { success: false };
  }
}
