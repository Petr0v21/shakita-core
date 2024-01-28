import { Field, ArgsType } from '@nestjs/graphql';

@ArgsType()
export class RegisterGoogleArgs {
  @Field()
  token: string;
}
