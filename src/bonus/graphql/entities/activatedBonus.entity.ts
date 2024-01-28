import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/graphql/user.entity';
import { BonusTicket } from './bonusTicket.entity';

@Entity()
@ObjectType()
export class ActivatedBonus extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => BonusTicket)
  @JoinColumn({ name: 'bonusTicketId' })
  bonusTicket: BonusTicket;

  @Column()
  @Field()
  userId: string;

  @Column()
  @Field()
  bonusTicketId: string;

  @Column()
  @Field()
  activatedByUserId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'activatedByUserId' })
  activatedByUser: User;
}
