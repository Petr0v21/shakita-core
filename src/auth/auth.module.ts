import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './guard/jwt.strategy';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/graphql/user.entity';
import { AuthResolver } from './graphql/auth.resolver';
import { SessionModule } from 'src/session/session.module';
import { HttpModule } from '@nestjs/axios';
import { Application } from 'src/application/graphql/application.entity';
import { UserModule } from 'src/user/user.module';
import { ApplicationModule } from 'src/application/application.module';
import { BonusModule } from 'src/bonus/bonus.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'your_secret_key',
    }),
    TypeOrmModule.forFeature([User, Application]),
    SessionModule,
    HttpModule,
    UserModule,
    ApplicationModule,
    BonusModule,
  ],
  providers: [JwtStrategy, AuthService, AuthResolver],
  exports: [PassportModule, JwtModule],
})
export class AuthModule {}
