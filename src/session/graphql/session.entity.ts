import { User } from 'src/user/graphql/user.entity';
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
import { GraphQLJSON } from 'graphql-type-json';

@Entity()
@ObjectType()
export class Session extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @Column()
  @Field()
  refreshToken: string;

  @Column()
  @Field()
  ip: string;

  @Column({ type: 'json', nullable: true })
  @Field(() => GraphQLJSON, { nullable: true })
  userAgent: Record<string, any>;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @Column({ nullable: true })
  @Field({ nullable: true })
  endAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.sessions)
  user: User;
}
