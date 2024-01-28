import { Field, ArgsType } from '@nestjs/graphql';
import { IsEmail, IsOptional } from 'class-validator';
import { ApplicationStatus } from '../application.enum';

@ArgsType()
export class CreateOneApplicationArgs {
  @Field()
  place: string;

  @Field()
  date: Date;

  @Field()
  name: string;

  @IsOptional()
  @Field({ nullable: true })
  phone?: string;

  @IsOptional()
  @Field({ nullable: true })
  telegram?: string;

  @IsOptional()
  @Field({ nullable: true })
  instagram?: string;

  @IsEmail()
  @Field()
  email: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ defaultValue: true })
  enable_notification?: boolean;

  @Field(() => ApplicationStatus, { nullable: true })
  status?: ApplicationStatus;
}
