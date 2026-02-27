import { Injectable, Logger } from '@nestjs/common';
import { Either, left, right } from '@/src/common/errors/either';
import { UserRepository } from '../../../domain/repositories/user-repository';
import { UserNotFoundError } from '../../../domain/errors/user-not-found-error';
import { DeleteUserUseCaseInput } from './dto/delete-user.input.dto';
import { UserNotAvailableError } from '../../../domain/errors/user-not-available-error';

@Injectable()
export class DeleteUserUseCase {
  private readonly logger: Logger;
  constructor(private readonly userRepository: UserRepository) {
    this.logger = new Logger(DeleteUserUseCase.name);
  }

  async execute(input: DeleteUserUseCaseInput): Promise<Either<Error, void>> {
    this.logger.log(`Call ${DeleteUserUseCase.name}.execute method`);
    try {
      this.logger.log(
        `DeleteUserUseCaseInput received: ${JSON.stringify(input)}`,
      );

      this.logger.log(`Checking existing users by id=${input.id}`);

      const existingUser = await this.userRepository.findById(input.id);

      if (!existingUser) {
        return left(new UserNotFoundError());
      }

      this.logger.log(
        `User found for id=${input.id} checking if user is already deleted`,
      );

      if (existingUser.deletedAt) {
        return left(new UserNotAvailableError());
      }

      await this.userRepository.delete(input.id);

      return right(undefined);
    } catch (error) {
      const handledError =
        error instanceof Error ? error : new Error('Failed to delete user');
      this.logger.error(
        `Error deleting user: ${handledError.message} stack: ${handledError.stack}`,
      );
      return left(handledError);
    }
  }
}
