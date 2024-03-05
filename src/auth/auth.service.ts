import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/graphql/user.entity';
import * as jwt from 'jsonwebtoken';
import { GoogleResponse } from './types';
import axios from 'axios';
import { ApplicationService } from 'src/application/application.service';
import { SessionService } from 'src/session/session.service';
import { BonusService } from 'src/bonus/bonus.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly applicationService: ApplicationService,
    private readonly sessionService: SessionService,
    private readonly bonusService: BonusService,
  ) {}

  async checkRefreshToken(token: string) {
    const decodedToken = await jwt.verify(
      token,
      process.env.JWT_SECRET ?? 'your_secret_key',
    );
    const expirationDate = new Date(decodedToken.exp * 1000);
    const currentDate = new Date();
    if (expirationDate < currentDate) {
      this.sessionService.finishSession(token);
      throw new UnauthorizedException();
    }
  }

  async updateUserAplication(user: User) {
    return await this.applicationService.addUserToApplications(user);
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.userService.findByUsername(username);
    if (user && user.password === password && !user.isGoogleAuth) {
      return user;
    }
    return null;
  }

  async validateUserById(userId: string): Promise<User | null> {
    return this.userService.findById(userId);
  }

  async validateUserByUsername(username: string): Promise<User | null> {
    return this.userService.findByUsername(username);
  }

  async checkGoogleToken(
    access_token: string,
  ): Promise<GoogleResponse | any | null> {
    try {
      return (
        await axios.get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${access_token}`,
        )
      ).data;
    } catch (err) {
      return null;
    }
  }

  async generateTokens(
    user: User,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessTokenPayload = { userId: user.id };
    const refreshTokenPayload = { userId: user.id, tokenType: 'refresh' };

    const accessToken = await this.jwtService.signAsync(accessTokenPayload, {
      expiresIn: '15m',
    });
    const refreshToken = await this.jwtService.signAsync(refreshTokenPayload, {
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }
}
