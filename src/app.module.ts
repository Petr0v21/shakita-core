import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AuthMiddleware } from './auth/auth.middleware';
import { JwtGuard } from './auth/guard/jwt.guard';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { SessionModule } from './session/session.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { ApplicationModule } from './application/application.module';
import { BonusModule } from './bonus/bonus.module';
import { ShedulesModule } from './shedules/shedules.module';
import { AuthCodeModule } from './authcode/authcode.module';
import { S3Module } from './s3/s3.module';
import { MulterModule } from '@nestjs/platform-express';
import { AnalyticsModule } from './analytics/analytics.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      playground: true,
    }),
    //TODO env
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: ['dist/**/*.entity{.ts,.js}'],
      autoLoadEntities: true,
      synchronize: true,
      ssl: true,
    }),
    UserModule,
    SessionModule,
    AuthModule,
    ApplicationModule,
    BonusModule,
    ShedulesModule,
    AuthCodeModule,
    S3Module,
    AnalyticsModule,
    MulterModule.register({
      dest: './upload',
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: 'bilwork.info@gmail.com',
          pass: 'rjyfanutytjiwfdk',
        },
      },
    }),
  ],
  providers: [JwtGuard],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
