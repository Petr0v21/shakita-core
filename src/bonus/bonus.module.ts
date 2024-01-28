import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bonus } from './graphql/entities/bonus.enity';
import { BonusTicket } from './graphql/entities/bonusTicket.entity';
import { BonusResolver } from './graphql/bonus.resolver';
import { BonusService } from './bonus.service';
import { ActivatedBonus } from './graphql/entities/activatedBonus.entity';
import { User } from 'src/user/graphql/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bonus, BonusTicket, ActivatedBonus, User]),
  ],
  providers: [BonusResolver, BonusService],
  exports: [BonusService],
})
export class BonusModule {}
