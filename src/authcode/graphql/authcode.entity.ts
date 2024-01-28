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

@Entity()
@ObjectType()
export class AuthCode extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @Column()
  @Field()
  code: string;

  @Column()
  @Field()
  email: string;

  @Column({
    default: true,
  })
  @Field()
  status_active: boolean;

  @Column({
    default: new Date(Date.now() + 1000 * 60 * 5),
  })
  @Field()
  deadAt: Date;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.authcode)
  user: User;
}
