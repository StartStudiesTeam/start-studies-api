import { ServiceError } from '@/src/common/errors/service-error';
import { statusCode } from '@/src/common/types/statusCode';

export class RoadmapFetchUserNotFoundError
  extends Error
  implements ServiceError
{
  statusCode: number = statusCode.NOT_FOUND;

  constructor() {
    super('It was not possible to fetch roadmap with this user');
    this.name = 'RoadmapFetchUserNotFoundError';
  }
}
