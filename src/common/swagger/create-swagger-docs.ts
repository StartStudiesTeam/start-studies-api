import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { swaggerRegisterModules } from './swagger-register-modules';
import * as fs from 'node:fs';
import * as path from 'node:path';

const getAppVersion = () => {
  const packageJsonPath = path.resolve(process.cwd(), 'package.json');
  const packageJson = fs.readFileSync(packageJsonPath, 'utf-8');
  const { version } = JSON.parse(packageJson) as { version?: string };

  if (!version) {
    throw new Error('Could not resolve app version from package.json');
  }

  return version;
};

export const createSwaggerDocs = async (app: INestApplication) => {
  const document = createDocuments(app);

  SwaggerModule.setup('/docs', app, document);
};

export const createDocuments = function (app) {
  const config = new DocumentBuilder()
    .setTitle('start-studies-api')
    .setDescription('Documentation of Start Studies API')
    .setVersion(getAppVersion())
    .addBearerAuth({ type: 'http' })
    .build();

  return SwaggerModule.createDocument(app, config, {
    include: swaggerRegisterModules,
  });
};
