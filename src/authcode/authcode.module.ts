import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthCode } from './graphql/authcode.entity';
import { AuthCodeService } from './authcode.service';
import { User } from '../user/graphql/user.entity';
import { AuthCodeResolver } from './graphql/authcode.resolver';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([AuthCode, User]), UserModule],
  providers: [AuthCodeService, AuthCodeResolver],
})
export class AuthCodeModule {}
