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
import { randomUUID } from 'crypto';
import { BonusTicketType } from 'src/bonus/graphql/bonusTicket.enum';
import { BonusLevelType } from 'src/bonus/graphql/bonusValueType.enum';

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

  async addPersonalBonus(userId: string) {
    try {
      const bonus = await this.bonusService.findBonus({
        asset: 'personal',
        isActive: true,
        level: BonusLevelType.JUNIOR,
      });
      if (!bonus.length) {
        console.error('Empty personal bonus');
        return false;
      }
      const result = await this.bonusService.createBonusTicket({
        userId,
        code: randomUUID(),
        ticketType: BonusTicketType.CONST,
        bonusId: bonus[0].id,
      });
      return !!result;
    } catch (err) {
      console.error('Error Add personal bonus!', err);
      return false;
    }
  }
}
