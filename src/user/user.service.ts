import { Injectable } from '@nestjs/common';
import { User } from './graphql/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { GetUsersArgs } from './graphql/args/GetUsersArgs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async find(args: GetUsersArgs) {
    let filter = [];
    if (args.id) {
      filter = [
        {
          id: args.id,
        },
      ];
    } else if (args.contact) {
      filter = [
        {
          email: Like(`%${args.contact}%`),
        },
        {
          phone: Like(`%${args.contact}%`),
        },
        {
          telegram: Like(`%${args.contact}%`),
        },
        {
          instagram: Like(`%${args.contact}%`),
        },
      ];
    } else {
      filter = [
        {
          role: args.role ?? null,
          name: args.name ? Like(`%${args.name}%`) : null,
        },
      ];
    }

    if (!Object.entries(filter[0]).find((item) => item[1] !== null)) {
      filter = [];
    }
    return await this.userRepository.find({
      where: filter,
      order: {
        createdAt: 'ASC',
      },
      skip: args.skip ?? 0,
      take: args.take ?? 15,
    });
  }

  async findByUsername(email: string) {
    return await this.userRepository.findOne({
      where: {
        email,
      },
    });
  }

  async findById(id: string) {
    return await this.userRepository.findOne({
      where: {
        id,
      },
      relations: [
        'applications',
        'sessions',
        'bonusTickets',
        'bonusTickets.bonus',
      ],
    });
  }

  async create(args: Partial<User>) {
    return await this.userRepository.save(args);
  }

  async delete(id: string) {
    return await this.userRepository.delete(id);
  }

  async update(id: string, args: any) {
    return await this.userRepository.update(id, args);
  }
}
