import { ServiceError } from '@/src/common/errors/service-error';
import { statusCode } from '@/src/common/types/statusCode';

export class RoadmapCreationUserDeletedError extends Error implements ServiceError {
  statusCode: number = statusCode.CONFLICT;

  constructor() {
    super('It was not possible to create roadmap because user is deleted');
    this.name = 'RoadmapCreationUserDeletedError';
  }
}
