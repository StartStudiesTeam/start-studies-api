import { ServiceError } from '@/src/common/errors/service-error';
import { statusCode } from '@/src/common/types/statusCode';

export class RoadmapCreationUserNotFoundError
  extends Error
  implements ServiceError
{
  statusCode: number = statusCode.NOT_FOUND;

  constructor() {
    super('It was not possible to create roadmap with this user');
    this.name = 'RoadmapCreationUserNotFoundError';
  }
}
