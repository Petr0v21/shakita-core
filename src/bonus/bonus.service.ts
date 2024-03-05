import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Bonus } from './graphql/entities/bonus.enity';
import { BonusTicket } from './graphql/entities/bonusTicket.entity';
import { ActivatedBonus } from './graphql/entities/activatedBonus.entity';
import { ActiveBonusTicketArgs } from './graphql/args/ActiveBonusTicketArgs';
import { UniqueArgs } from 'src/graphql/args/UniqueArgs';
import {
  CreateOneBonusTicketArgs,
  UpdateOneBonusTicketArgs,
} from './graphql/args/CreateOneBonusTicketArgs';
import { User } from 'src/user/graphql/user.entity';
import { BonusTicketType } from './graphql/bonusTicket.enum';
import { GetBonusTicketArgs } from './graphql/args/GetBonusTicketArgs';
import {
  CreateOneBonusArgs,
  UpdateOneBonusArgs,
} from './graphql/args/CreateOneBonusArgs';
import { GetBonusArgs } from './graphql/args/GetBonusArgs';
import { BonusTicketWholeType } from './graphql/bonus.type';
import { randomUUID } from 'crypto';
import { BonusLevelType } from './graphql/bonusValueType.enum';

@Injectable()
export class BonusService {
  constructor(
    @InjectRepository(Bonus)
    private bonusRepository: Repository<Bonus>,
    @InjectRepository(BonusTicket)
    private bonusTicketRepository: Repository<BonusTicket>,
    @InjectRepository(ActivatedBonus)
    private activatedBonusRepository: Repository<ActivatedBonus>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  private async isActiveBonusTicket(ticket: BonusTicket, userId: string) {
    const activetedBonus = Boolean(
      await this.activatedBonusRepository.findOne({
        where: {
          bonusTicketId: ticket.id,
          userId,
        },
      }),
    );

    const isAlreadyActivated =
      ticket.ticketType === BonusTicketType.DISPOSABLE ? !activetedBonus : true;
    const isActiveBonus = ticket.bonus.isActive;
    const isActiveBonusTicket =
      !ticket.activeTill || ticket.activeTill < new Date();
    const isUserCanActivate = ticket.user.id === userId;

    return (
      isActiveBonus &&
      isActiveBonusTicket &&
      isUserCanActivate &&
      isAlreadyActivated
    );
  }

  async activateBonus(args: ActiveBonusTicketArgs, activator: User) {
    try {
      const ticket = await this.bonusTicketRepository.findOne({
        where: {
          id: args.bonusTicketId,
          isActive: true,
        },
        relations: ['user', 'bonus'],
      });
      if (!ticket) {
        throw new BadRequestException(`Ticket not active`);
      }

      const isValid = await this.isActiveBonusTicket(ticket, args.userId);

      if (!isValid) {
        throw new BadRequestException(`Can't activate`);
      }
      const result = await this.activatedBonusRepository.save({
        ...args,
        activatedByUserId: activator.id,
      });

      try {
        if (result) {
          if (
            ticket.ticketType === BonusTicketType.CONST &&
            ticket.bonus.condition !== null &&
            ticket.bonus.level !== null
          ) {
            const countAcivedBonus =
              (await this.activatedBonusRepository.count({
                where: {
                  bonusTicketId: args.bonusTicketId,
                  userId: args.userId,
                },
              })) + 1;
            if (ticket.bonus.condition <= countAcivedBonus) {
              const newBonus = await this.bonusRepository.findOne({
                where: {
                  level: ticket.bonus.level + 1,
                  asset: ticket.bonus.asset,
                },
              });
              if (newBonus) {
                await this.deleteBonusTicket({ id: ticket.id });
                await this.createBonusTicket({
                  bonusId: newBonus.id,
                  ticketType: ticket.ticketType,
                  userId: ticket.user.id,
                  code: randomUUID(),
                });
              }
            }
          } else if (ticket.ticketType === BonusTicketType.DISPOSABLE) {
            await this.deleteBonusTicket({ id: ticket.id });
          }
        }
      } catch (error) {
        console.error(error);
      }
      return !!result;
    } catch (err) {
      console.error('activateBonus Error', err);
      throw err;
    }
  }

  async createBonus(args: CreateOneBonusArgs) {
    return await this.bonusRepository.save(args);
  }

  async createBonusTicket(args: CreateOneBonusTicketArgs) {
    try {
      const queryArgs = args;

      const bonus = await this.bonusRepository.findOne({
        where: {
          id: args.bonusId,
        },
      });

      queryArgs['bonus'] = bonus;

      if (args.userId) {
        const user = await this.userRepository.findOne({
          where: {
            id: args.userId,
          },
        });
        queryArgs['user'] = user;
      }

      return await this.bonusTicketRepository.save(queryArgs);
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async deleteBonus(args: UniqueArgs) {
    const bonus = await this.bonusRepository.findOne({
      where: {
        id: args.id,
      },
      relations: ['tickets'],
    });

    await Promise.all(
      bonus.tickets?.map(async (ticket) => {
        await this.bonusTicketRepository.delete(ticket.id);
      }),
    );

    return await this.bonusRepository.delete(args.id);
  }

  async deleteBonusTicket(args: UniqueArgs) {
    return await this.bonusTicketRepository.update(args.id, {
      isActive: false,
    });
  }

  async updateBonus(args: UpdateOneBonusArgs) {
    return await this.bonusRepository.update(args.id, args);
  }

  async updateBonusTicket(args: UpdateOneBonusTicketArgs) {
    return await this.bonusTicketRepository.update(args.id, args);
  }

  async findBonus(args: GetBonusArgs) {
    const { id, valueType, isActive, asset, level, skip = 0, take = 15 } = args;

    const where: any = {
      id,
      valueType,
      level,
      isActive,
      asset: asset ? ILike(`%${asset}%`) : undefined,
    };

    Object.keys(where).forEach(
      (key) => where[key] === undefined && delete where[key],
    );

    return await this.bonusRepository.find({
      where,
      order: {
        createdAt: 'ASC',
      },
      skip,
      take,
    });
  }

  async findBonusById({ id }: UniqueArgs) {
    return await this.bonusRepository.findOneBy({ id });
  }

  async findBonusTicketById(id: string) {
    return await this.bonusTicketRepository.findOne({
      where: {
        id,
      },
      relations: ['bonus'],
    });
  }

  async findBonusTicketByCode(
    args: GetBonusTicketArgs,
  ): Promise<BonusTicketWholeType> {
    return (await this.bonusTicketRepository.findOne({
      where: { ...args },
      relations: ['bonus', 'user'],
    })) as BonusTicketWholeType;
  }

  async findManyBonusTicketsByUserId(id: string) {
    return await this.bonusTicketRepository.findOne({
      where: {
        user: {
          id,
        },
      },
      relations: ['bonus'],
    });
  }

  async addPersonalBonus(userId: string) {
    try {
      const bonus = await this.bonusRepository.findOne({
        where: {
          level: BonusLevelType.JUNIOR,
          isActive: true,
          asset: 'personal', //TODO GET FROM BIN
        },
      });
      if (bonus) {
        await this.createBonusTicket({
          bonusId: bonus.id,
          userId,
          code: randomUUID(),
          ticketType: BonusTicketType.CONST,
        });
      }
    } catch (err) {
      console.error(err);
    }
  }
}
