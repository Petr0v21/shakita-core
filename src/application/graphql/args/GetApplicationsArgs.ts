import { Field, ArgsType } from '@nestjs/graphql';
import { ApplicationStatus } from '../application.enum';
import { IsDate, IsEmail, IsOptional, IsUUID } from 'class-validator';
import { ListArgs } from 'src/graphql/args/ListArgs';

@ArgsType()
export class GetApplicationsArgs extends ListArgs {
  @IsOptional()
  @IsUUID()
  @Field({ nullable: true })
  id?: string;

  @IsOptional()
  @Field({ nullable: true })
  place?: string;

  @IsOptional()
  @IsDate()
  @Field({ nullable: true })
  date_from?: Date;

  @IsOptional()
  @IsDate()
  @Field({ nullable: true })
  date_to?: Date;

  @Field(() => ApplicationStatus, {
    nullable: true,
    // defaultValue: ApplicationStatus.APPROVED,
  })
  status?: ApplicationStatus;
}

@ArgsType()
export class GetApplicationsByDateArgs {
  @IsDate()
  @Field()
  date: Date;

  // @Field(() => ApplicationStatus, {
  //   nullable: true,
  //   defaultValue: ApplicationStatus.APPROVED,
  // })
  // status?: ApplicationStatus;
}

@ArgsType()
export class GetApplicationsHystoryArgs {
  @IsEmail()
  @Field()
  email: string;
}
