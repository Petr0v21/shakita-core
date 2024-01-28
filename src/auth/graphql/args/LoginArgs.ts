import { Field, ArgsType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@ArgsType()
export class LoginArgs {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  password: string;
}
