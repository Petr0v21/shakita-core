import {
  UnauthorizedException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { LoginArgs } from './args/LoginArgs';
import { Tokens } from './models/Tokens';
import { UserService } from 'src/user/user.service';
import { RefreshArgs } from './args/RefreshArgs';
import { SessionService } from 'src/session/session.service';
import * as UAParser from 'ua-parser-js';
import { RegisterArgs } from './args/RegisterArgs';
import { RegisterGoogleArgs } from './args/RegisterGoogleArgs';
import { GoogleResponse } from '../types';
import { SuccessOutput } from 'src/graphql/dto/SuccessOutput';
import { UserRole } from 'src/user/graphql/userRole.enum';

@Resolver()
export class AuthResolver {
  private parser = new UAParser();

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly sessionService: SessionService,
  ) {}

  @Query(() => Tokens)
  async login(
    @Args() args: LoginArgs,
    @Context() context: any,
  ): Promise<Tokens> {
    const ip = context.req.ip; //TODO true ip
    const userAgent = context.req.headers['user-agent'];
    const parsedUserAgent = this.parser.setUA(userAgent).getResult();

    const user = await this.authService.validateUser(args.email, args.password);
    if (!user) {
      throw new UnauthorizedException();
    }
    if (user.role === UserRole.blocked) {
      throw new ForbiddenException();
    }
    const session =
      await this.sessionService.findSessionByUserIdAndIpAndUserAgent(
        user,
        context.req.ip,
        parsedUserAgent,
      );

    const tokens = await this.authService.generateTokens(user);

    if (session) {
      await this.authService.checkRefreshToken(session.refreshToken);

      await this.sessionService.update({
        ...session,
        user,
        refreshToken: tokens.refreshToken,
        ip,
        userAgent: parsedUserAgent,
      });
    } else {
      await this.sessionService.create({
        user,
        refreshToken: tokens.refreshToken,
        ip,
        userAgent: parsedUserAgent,
      });
    }

    return tokens;
  }

  @Mutation(() => Tokens)
  async register(
    @Args() args: RegisterArgs,
    @Context() context: any,
  ): Promise<Tokens> {
    const user = await this.userService.create(args).catch(() => null);
    if (!user) {
      throw new BadRequestException();
    }
    const ip = context.req.ip; //TODO true ip
    const userAgent = context.req.headers['user-agent'];
    const parsedUserAgent = this.parser.setUA(userAgent).getResult();

    const tokens = await this.authService.generateTokens(user);

    const result = await this.sessionService.create({
      user,
      refreshToken: tokens.refreshToken,
      ip,
      userAgent: parsedUserAgent,
    });
    if (result.user.email) {
      await this.authService.updateUserAplication(user);
      await this.authService.addPersonalBonus(user.id);
    }
    return tokens;
  }

  @Mutation(() => Tokens)
  async authGoogle(
    @Args() args: RegisterGoogleArgs,
    @Context() context: any,
  ): Promise<any> {
    const ip = context.req.ip; //TODO true ip
    const userAgent = context.req.headers['user-agent'];
    const parsedUserAgent = this.parser.setUA(userAgent).getResult();

    const check = await this.authService.checkGoogleToken(args.token);

    if (!check || check.error) {
      throw new UnauthorizedException();
    }
    console.log(check);
    const user = await this.authService.validateUserByUsername(check.email);
    if (!user) {
      const { id, ...body } = check as GoogleResponse;

      const newUser = await this.userService.create({
        ...body,
        google_id: id,
        isGoogleAuth: true,
      });
      if (!newUser) {
        throw new UnauthorizedException();
      }
      const tokens = await this.authService.generateTokens(user);

      const result = await this.sessionService.create({
        newUser,
        refreshToken: tokens.refreshToken,
        ip,
        userAgent: parsedUserAgent,
      });

      if (result.user.email) {
        await this.authService.updateUserAplication(newUser);
        await this.authService.addPersonalBonus(newUser.id);
      }

      return tokens;
    } else {
      if (user.role === UserRole.blocked) {
        throw new ForbiddenException();
      }
      const session =
        await this.sessionService.findSessionByUserIdAndIpAndUserAgent(
          user,
          context.req.ip,
          parsedUserAgent,
        );

      const tokens = await this.authService.generateTokens(user);

      if (session) {
        await this.authService.checkRefreshToken(session.refreshToken);

        await this.sessionService.update({
          ...session,
          user,
          refreshToken: tokens.refreshToken,
          ip,
          userAgent: parsedUserAgent,
        });
      } else {
        await this.sessionService.create({
          user,
          refreshToken: tokens.refreshToken,
          ip,
          userAgent: parsedUserAgent,
        });
      }
      return tokens;
    }
  }

  @Query(() => Tokens)
  async refresh(@Args() args: RefreshArgs): Promise<Tokens> {
    const session = await this.sessionService.findSessionWithUserByRefreshToken(
      args.token,
    );

    if (!session) {
      throw new BadRequestException();
    }
    if (session.user.role === UserRole.blocked) {
      throw new ForbiddenException();
    }

    await this.authService.checkRefreshToken(session.refreshToken);

    const tokens = await this.authService.generateTokens(session.user);

    await this.sessionService.update({
      ...session,
      refreshToken: tokens.refreshToken,
    });

    return tokens;
  }

  @Mutation(() => SuccessOutput)
  async logout(
    @Args() args: RefreshArgs,
    @Context() context: any,
  ): Promise<SuccessOutput> {
    try {
      const session =
        await this.sessionService.findSessionWithUserByRefreshToken(args.token);

      if (!session || session.user.id !== context.req.user.id) {
        throw new BadRequestException();
      }

      await this.authService.checkRefreshToken(session.refreshToken);

      await this.sessionService.update({
        id: session.id,
        endAt: new Date(),
      });

      return { success: true };
    } catch {
      return { success: false };
    }
  }
}
