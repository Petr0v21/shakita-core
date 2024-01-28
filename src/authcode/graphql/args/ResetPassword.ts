import { Field, ArgsType } from '@nestjs/graphql';
import { IsEmail, Length, MinLength } from 'class-validator';

@ArgsType()
export class ResetPassworEmailArgs {
  @IsEmail()
  @Field()
  email: string;
}

@ArgsType()
export class ResetPassworCodedArgs {
  @Field()
  code: string;

  @IsEmail()
  @Field()
  email: string;
}

@ArgsType()
export class ResetPasswordWithCodeArgs {
  @IsEmail()
  @Field()
  email: string;

  // @Length()
  @Field()
  code: string;

  @MinLength(6)
  @Field()
  password: string;
}
