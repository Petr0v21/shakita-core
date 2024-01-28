import { Field, ArgsType } from '@nestjs/graphql';
import { ApplicationStatus } from '../application.enum';
import { IsDate, IsEmail, IsOptional } from 'class-validator';

@ArgsType()
export class UpdateOneApplicationArgs {
  @Field()
  id: string;

  @Field({ nullable: true })
  place?: string;

  @IsOptional()
  @IsDate()
  @Field({ nullable: true })
  date?: Date;

  @IsOptional()
  @Field(() => ApplicationStatus, { nullable: true })
  status?: ApplicationStatus;

  @IsOptional()
  @Field({ nullable: true })
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

  @IsOptional()
  @IsEmail()
  @Field({ nullable: true })
  email: string;

  @IsOptional()
  @Field({ nullable: true })
  description?: string;

  @IsOptional()
  @Field({ nullable: true })
  enable_notification?: boolean;
}
