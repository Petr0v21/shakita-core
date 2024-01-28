import { Field, ArgsType } from '@nestjs/graphql';
import { UserRole } from '../userRole.enum';
import { IsEmail, IsOptional, MinLength } from 'class-validator';

@ArgsType()
export class CreateOneUserArgs {
  @IsEmail()
  @Field({ nullable: true })
  email?: string;

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
  @Field({ nullable: true })
  enable_notifications: boolean;

  @IsOptional()
  @Field({ nullable: true })
  picture: string;

  @IsOptional()
  @MinLength(3)
  @Field({ nullable: true })
  name?: string;

  @MinLength(6)
  @Field({ nullable: true })
  password?: string;

  @Field(() => UserRole, { defaultValue: UserRole.user })
  role?: UserRole;

  @IsOptional()
  @Field({ nullable: true })
  verified_email?: boolean;
}
