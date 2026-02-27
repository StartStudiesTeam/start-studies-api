import { ServiceError } from '@/src/common/errors/service-error';
import { statusCode } from '@/src/common/types/statusCode';

export class InvalidSearchUsersInputError
  extends Error
  implements ServiceError
{
  statusCode: number = statusCode.BAD_REQUEST;

  constructor(reason: string) {
    super(`Invalid users search input: ${reason}`);
    this.name = 'InvalidSearchUsersInputError';
  }
}
