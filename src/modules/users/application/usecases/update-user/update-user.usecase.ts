import { Injectable, Logger } from '@nestjs/common';
import { Either, left, right } from '@/src/common/errors/either';
import { UserRepository } from '../../../domain/repositories/user-repository';
import { UsersMapper } from '../../../infra/mappers/users.mapper';
import { UpdateUserUseCaseInput } from './dto/update-user.input.dto';
import { UpdateUserUseCaseOutput } from './dto/update-user.output.dto';
import { UserNotFoundError } from '../../../domain/errors/user-not-found-error';
import { UpdateUserPersistenceError } from '../../../domain/errors/update-user-persistence-error';

@Injectable()
export class UpdateUserUseCase {
  private readonly logger: Logger;
  constructor(private readonly userRepository: UserRepository) {
    this.logger = new Logger(UpdateUserUseCase.name);
  }

  async execute(
    input: UpdateUserUseCaseInput,
  ): Promise<
    Either<
      UserNotFoundError | UpdateUserPersistenceError,
      UpdateUserUseCaseOutput
    >
  > {
    this.logger.log(`Call ${UpdateUserUseCase.name}.execute method`);
    try {
      this.logger.log(
        `UpdateUserUseCaseInput received: ${JSON.stringify(input)}`,
      );

      this.logger.log(`Checking existing users by id=${input.id}`);

      const existingUser = await this.userRepository.findById(input.id);

      if (!existingUser) {
        return left(new UserNotFoundError());
      }

      this.logger.log(`User found for id=${input.id}`);

      const mergedUserData = UsersMapper.mapUpdateUserInputToUser(
        existingUser,
        input,
      );

      const updatedUser = await this.userRepository.update(mergedUserData);

      const output = UsersMapper.mapUserToUpdateUserUseCaseOutput(updatedUser);
      return right(output);
    } catch (error) {
      const handledError = new UpdateUserPersistenceError();
      this.logger.error(
        `Error updating user: ${handledError.message}`,
        error instanceof Error ? error.stack : undefined,
      );
      return left(handledError);
    }
  }
}
