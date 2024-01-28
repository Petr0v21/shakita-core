import { Field, ObjectType } from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApplicationStatus } from './application.enum';
import { User } from 'src/user/graphql/user.entity';

//TODO add bonus

@Entity()
@ObjectType()
export class Application extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @Column()
  @Field()
  email: string;

  @Column()
  @Field()
  place: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  phone?: string;

  @Column({ default: 'shakita-user' })
  @Field()
  name?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  telegram?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  instagram?: string;

  @Column({ default: true })
  @Field()
  enable_notification: boolean;

  @Column({ default: ApplicationStatus.PENDING })
  @Field(() => ApplicationStatus)
  status: ApplicationStatus;

  @Column({ default: new Date() })
  @Field()
  date: Date;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.applications, { nullable: true })
  user?: User;
}
