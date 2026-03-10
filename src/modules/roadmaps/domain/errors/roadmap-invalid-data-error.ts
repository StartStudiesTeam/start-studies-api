import { ServiceError } from '@/src/common/errors/service-error';
import { statusCode } from '@/src/common/types/statusCode';

export class RoadmapInvalidDataError extends Error implements ServiceError {
  statusCode: number = statusCode.BAD_REQUEST;

  constructor(reason: string) {
    super(`It was not possible to create the roadmap: ${reason}`);
    this.name = 'RoadmapInvalidDataError';
  }
}
