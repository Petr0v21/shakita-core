import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-type-json';
import { BonusTicket } from './bonusTicket.entity';
import { BonusLevelType, BonusValueType } from '../bonusValueType.enum';

@Entity()
@ObjectType()
export class Bonus extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @Column()
  @Field()
  count: number;

  @Column()
  @Field()
  asset: string;

  @Column()
  @Field()
  description: string;

  @Column({ default: false })
  @Field({ defaultValue: false })
  isActive: boolean;

  @Column({ nullable: true })
  @Field({
    nullable: true,
    description: 'How much activations must be for new level',
  })
  condition?: number;

  @Column({ nullable: true })
  @Field(() => BonusLevelType, { nullable: true })
  level?: BonusLevelType;

  @Column({ default: BonusValueType.POINT })
  @Field(() => BonusValueType, { defaultValue: BonusValueType.POINT })
  valueType: BonusValueType;

  @Column({ type: 'json', nullable: true })
  @Field(() => GraphQLJSON, { nullable: true })
  payload: Record<string, any>;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;

  @OneToMany(() => BonusTicket, (ticket) => ticket.bonus)
  tickets?: BonusTicket[];
}
