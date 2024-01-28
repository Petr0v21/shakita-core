import { Field, ArgsType } from '@nestjs/graphql';
import { IsEmail, IsOptional, MinLength } from 'class-validator';
import { UserRole } from '../userRole.enum';

@ArgsType()
export class UpdateOneUserArgs {
  @Field()
  id: string;

  @IsOptional()
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
  enable_notifications?: boolean;

  @IsOptional()
  @Field({ nullable: true })
  isFullAuth?: boolean;

  @IsOptional()
  @Field({ nullable: true })
  verified_email?: boolean;

  @IsOptional()
  @Field({ nullable: true })
  picture: string;

  @IsOptional()
  @MinLength(3)
  @Field({ nullable: true })
  name?: string;

  @IsOptional()
  @Field(() => UserRole, { nullable: true })
  role?: UserRole;

  @IsOptional()
  @MinLength(6)
  @Field({ nullable: true })
  password?: string;
}
