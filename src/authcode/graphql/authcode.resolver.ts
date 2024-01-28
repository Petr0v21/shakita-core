import { AuthCodeService } from '../authcode.service';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { SuccessOutput } from 'src/graphql/dto/SuccessOutput';
import {
  ResetPassworCodedArgs,
  ResetPassworEmailArgs,
  ResetPasswordWithCodeArgs,
} from './args/ResetPassword';

@Resolver()
export class AuthCodeResolver {
  constructor(private readonly authcodeService: AuthCodeService) {}

  @Mutation(() => SuccessOutput)
  async getCode(@Args() args: ResetPassworEmailArgs): Promise<SuccessOutput> {
    return await this.authcodeService.codeCreateAndCheckEmail(args.email);
  }

  @Query(() => SuccessOutput)
  async checkCode(@Args() args: ResetPassworCodedArgs): Promise<SuccessOutput> {
    return await this.authcodeService.codeCheck(args.code, args.email);
  }

  @Mutation(() => SuccessOutput)
  async resetPasswordCode(
    @Args() args: ResetPasswordWithCodeArgs,
  ): Promise<SuccessOutput> {
    return await this.authcodeService.resetPassword(
      args.code,
      args.email,
      args.password,
    );
  }
}
