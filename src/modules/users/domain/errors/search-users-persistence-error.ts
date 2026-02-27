import { ServiceError } from '@/src/common/errors/service-error';
import { statusCode } from '@/src/common/types/statusCode';

export class SearchUsersPersistenceError extends Error implements ServiceError {
  statusCode: number = statusCode.INTERNAL_SERVER_ERROR;

  constructor() {
    super('Failed to search users');
    this.name = 'SearchUsersPersistenceError';
  }
}
