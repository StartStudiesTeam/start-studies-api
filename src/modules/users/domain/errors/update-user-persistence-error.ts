import { ServiceError } from '@/src/common/errors/service-error';
import { statusCode } from '@/src/common/types/statusCode';

export class UpdateUserPersistenceError extends Error implements ServiceError {
  statusCode: number = statusCode.INTERNAL_SERVER_ERROR;

  constructor() {
    super('Failed to update user');
    this.name = 'UpdateUserPersistenceError';
  }
}
