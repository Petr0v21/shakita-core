import { Field, ObjectType } from '@nestjs/graphql';
import { BonusTicket } from './entities/bonusTicket.entity';
import { Bonus } from './entities/bonus.enity';
import { User } from 'src/user/graphql/user.entity';

@ObjectType()
export class BonusTicketWholeType extends BonusTicket {
  @Field(() => Bonus, { nullable: true })
  bonus: Bonus;

  @Field(() => User, { nullable: true })
  user: User;
}
