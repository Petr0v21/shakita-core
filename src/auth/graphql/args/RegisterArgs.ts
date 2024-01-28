import { Field, ArgsType } from '@nestjs/graphql';
import { IsEmail, MinLength } from 'class-validator';

@ArgsType()
export class RegisterArgs {
  @Field()
  name: string;

  @Field()
  @IsEmail()
  email: string;

  @MinLength(6)
  @Field()
  password: string;

  @Field()
  phone: string;
}
