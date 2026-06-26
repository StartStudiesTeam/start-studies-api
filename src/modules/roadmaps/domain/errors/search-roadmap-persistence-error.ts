import { ServiceError } from '@/src/common/errors/service-error';
import { statusCode } from '@/src/common/types/statusCode';

export class SearchRoadmapPersistenceError
  extends Error
  implements ServiceError
{
  statusCode: number = statusCode.INTERNAL_SERVER_ERROR;

  constructor() {
    super('Failed to search roadmaps');
    this.name = 'SearchRoadmapPersistenceError';
  }
}
