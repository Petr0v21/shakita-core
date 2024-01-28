import { Resolver, Args, Mutation, Query, Context } from '@nestjs/graphql';
import { UniqueArgs } from 'src/graphql/args/UniqueArgs';
import { Bonus } from './entities/bonus.enity';
import { BonusService } from '../bonus.service';
import { BonusTicket } from './entities/bonusTicket.entity';
import { ActiveBonusTicketArgs } from './args/ActiveBonusTicketArgs';
import {
  CreateOneBonusArgs,
  UpdateOneBonusArgs,
} from './args/CreateOneBonusArgs';
import {
  CreateOneBonusTicketArgs,
  UpdateOneBonusTicketArgs,
} from './args/CreateOneBonusTicketArgs';
import { SuccessOutput } from 'src/graphql/dto/SuccessOutput';
import { GetBonusTicketArgs } from './args/GetBonusTicketArgs';
import { GetBonusArgs } from './args/GetBonusArgs';
import { BonusTicketWholeType } from './bonus.type';

@Resolver()
export class BonusResolver {
  constructor(private readonly bonusService: BonusService) {}

  @Query(() => BonusTicketWholeType, { nullable: true })
  async getTicket(
    @Args() args: GetBonusTicketArgs,
  ): Promise<BonusTicketWholeType> {
    return await this.bonusService.findBonusTicketByCode(args);
  }

  @Query(() => [Bonus], { nullable: true })
  async findBonus(@Args() args: GetBonusArgs): Promise<Bonus[]> {
    return await this.bonusService.findBonus(args);
  }

  @Mutation(() => Bonus, { nullable: true })
  async createBonus(@Args() args: CreateOneBonusArgs): Promise<Bonus> {
    return await this.bonusService.createBonus(args);
  }

  @Mutation(() => SuccessOutput, { nullable: true })
  async deleteBonus(@Args() args: UniqueArgs): Promise<SuccessOutput> {
    const result = await this.bonusService.deleteBonus(args);
    return { success: result.affected === 1 ? true : false };
  }

  @Mutation(() => BonusTicket, { nullable: true })
  async createBonusTicket(
    @Args() args: CreateOneBonusTicketArgs,
  ): Promise<BonusTicket> {
    return await this.bonusService.createBonusTicket(args);
  }

  @Mutation(() => SuccessOutput, { nullable: true })
  async updateBonus(@Args() args: UpdateOneBonusArgs): Promise<SuccessOutput> {
    const result = await this.bonusService.updateBonus(args);
    return { success: result.affected === 1 ? true : false };
  }

  @Mutation(() => SuccessOutput, { nullable: true })
  async updateBonusTicket(
    @Args() args: UpdateOneBonusTicketArgs,
  ): Promise<SuccessOutput> {
    const result = await this.bonusService.updateBonusTicket(args);
    return { success: result.affected === 1 ? true : false };
  }

  @Mutation(() => SuccessOutput, { nullable: true })
  async deleteBonusTicket(@Args() args: UniqueArgs): Promise<SuccessOutput> {
    const result = await this.bonusService.deleteBonusTicket(args);
    return { success: result.affected === 1 ? true : false };
  }

  @Mutation(() => SuccessOutput, { nullable: true })
  async activateBonus(
    @Args() args: ActiveBonusTicketArgs,
    @Context() context: any,
  ): Promise<SuccessOutput> {
    const result = await this.bonusService.activateBonus(
      args,
      context.req.user,
    );
    return { success: result };
  }
}
