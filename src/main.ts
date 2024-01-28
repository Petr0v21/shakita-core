import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  // app.use(graphqlUploadExpress({ maxFileSize: 25000000, maxFiles: 10 }));
  app.enableCors();
  await app.listen(Number(process.env.PORT ?? 3000) ?? 3000, () => {
    console.log('Server running on', Number(process.env.PORT ?? 3000), 'port');
  });
}
bootstrap();
