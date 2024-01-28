import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { Bonus } from './bonus.enity';
import { BonusTicketType } from '../bonusTicket.enum';
import { User } from 'src/user/graphql/user.entity';

@Entity()
@ObjectType()
export class BonusTicket extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @Column({ unique: true })
  @Field()
  code: string;

  @Column({ default: BonusTicketType.DISPOSABLE })
  @Field(() => BonusTicketType, { defaultValue: BonusTicketType.DISPOSABLE })
  ticketType: BonusTicketType;

  @Column({ nullable: true })
  @Field({ nullable: true })
  activeTill?: Date;

  @Column({ default: true })
  @Field({ defaultValue: true })
  isActive: boolean;

  @ManyToOne(() => Bonus, (bonus) => bonus.tickets)
  bonus: Bonus;

  @ManyToOne(() => User, (user) => user.bonusTickets)
  user?: User;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;
}
