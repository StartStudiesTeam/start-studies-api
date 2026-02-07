import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { createSwaggerDocs } from './common/swagger/create-swagger-docs';

const DOC_ROUTE = 'docs';
const API_PREFIX = '';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const API_PORT = configService.get('SERVER_PORT');

  await createSwaggerDocs(app);
  await app.listen(API_PORT, async () => {
    console.log(`RUNNING AT: ${await app.getUrl()}/${API_PREFIX}`);
    console.log(`DOCS: ${await app.getUrl()}/${DOC_ROUTE}`);
  });
}
bootstrap();
