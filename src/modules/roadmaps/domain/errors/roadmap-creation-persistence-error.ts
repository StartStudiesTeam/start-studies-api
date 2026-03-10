import { ServiceError } from '@/src/common/errors/service-error';
import { statusCode } from '@/src/common/types/statusCode';

export class RoadmapCreationPersistenceError extends Error implements ServiceError {
  statusCode: number = statusCode.INTERNAL_SERVER_ERROR;

  constructor() {
    super('It was not possible to create roadmap due to a persistence error');
    this.name = 'RoadmapCreationPersistenceError';
  }
}
