import { Field, ObjectType } from '@nestjs/graphql';
import { Application } from 'src/application/graphql/application.entity';
import { BonusTicket } from 'src/bonus/graphql/entities/bonusTicket.entity';
import { Session } from 'src/session/graphql/session.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from './userRole.enum';
import { AuthCode } from 'src/authcode/graphql/authcode.entity';

@Entity()
@ObjectType()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @Column({ unique: true })
  @Field()
  email: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  verified_email?: boolean;

  @Column({ nullable: true, default: false })
  @Field({ nullable: true })
  isGoogleAuth?: boolean;

  @Column({ nullable: true })
  @Field({ nullable: true })
  picture?: string;

  @Column({ nullable: true, default: 'shakita_user' })
  @Field({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  google_id?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  password?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  phone?: string;

  @Column({ default: true })
  @Field()
  enable_notifications: boolean;

  @Column({ default: false })
  @Field()
  isFullAuth: boolean;

  @Column({ default: UserRole.user })
  @Field(() => UserRole)
  role: UserRole;

  @Column({ nullable: true })
  @Field({ nullable: true })
  telegram?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  instagram?: string;

  @Column({ nullable: true, default: 0 })
  @Field({ nullable: true })
  rate?: number;

  @Column({ nullable: true })
  @Field({ nullable: true })
  client_assessment?: string;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;

  @OneToMany(() => Session, (session) => session.user)
  sessions?: Session[];

  @OneToMany(() => Application, (application) => application.user)
  applications?: Application[];

  @OneToMany(() => BonusTicket, (ticket) => ticket.user)
  bonusTickets?: BonusTicket[];

  @OneToMany(() => AuthCode, (authcode) => authcode.user)
  authcode?: AuthCode[];
}
