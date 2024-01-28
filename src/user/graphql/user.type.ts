import { Field, ObjectType } from '@nestjs/graphql';
import { UserRole } from './userRole.enum';
// import { SessionType } from 'src/session/graphql/session.type';
import { Session } from 'src/session/graphql/session.entity';
import { Application } from 'src/application/graphql/application.entity';
// import { BonusTicket } from 'src/bonus/graphql/entities/bonusTicket.entity';
import { BonusTicketWholeType } from 'src/bonus/graphql/bonus.type';

@ObjectType()
export class UserType {
  @Field()
  id: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  verified_email?: boolean;

  @Field({ nullable: true })
  isGoogleAuth?: boolean;

  @Field({ nullable: true })
  picture?: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  google_id?: string;

  @Field({ nullable: true })
  password?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  telegram?: string;

  @Field({ nullable: true })
  instagram?: string;

  @Field()
  enable_notifications: boolean;

  @Field()
  isFullAuth: boolean;

  @Field(() => UserRole)
  role: UserRole;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => [Session], { nullable: true })
  sessions?: Session[];

  @Field(() => [Application], { nullable: true })
  applications?: Application[];

  @Field(() => [BonusTicketWholeType], { nullable: true })
  bonusTickets?: BonusTicketWholeType[];
}
