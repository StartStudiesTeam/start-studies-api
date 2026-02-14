import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { createSwaggerDocs } from './common/swagger/create-swagger-docs';
import { ValidationPipe } from '@nestjs/common';

const DOC_ROUTE = 'docs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  const API_PORT = configService.get('SERVER_PORT');
  const NODE_ENV = configService.get('NODE_ENV');

  const isDevelopment = NODE_ENV === 'development';

  if (isDevelopment) {
    await createSwaggerDocs(app);
  }

  await app.listen(API_PORT, '0.0.0.0', async () => {
    console.log(`RUNNING AT: ${await app.getUrl()}/`);
    if (isDevelopment) {
      console.log(`DOCS: ${await app.getUrl()}/${DOC_ROUTE}`);
    }
  });
}
bootstrap();
