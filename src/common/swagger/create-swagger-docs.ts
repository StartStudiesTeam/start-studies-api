import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { swaggerRegisterModules } from './swagger-register-modules';

export const createSwaggerDocs = async (app: INestApplication) => {
  const document = createDocuments(app);

  SwaggerModule.setup('/docs', app, document);
};

export const createDocuments = function (app) {
  const config = new DocumentBuilder()
    .setTitle('start-studies-api')
    .setDescription('Documentation of Start Studies API')
    .setVersion('0.0.1')
    .addBearerAuth({ type: 'http' })
    .build();

  return SwaggerModule.createDocument(app, config, {
    include: swaggerRegisterModules,
  });
};
