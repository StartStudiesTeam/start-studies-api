import { Injectable, Logger } from '@nestjs/common';
import { Either, left, right } from '@/src/common/errors/either';
import { UserRepository } from '../../../domain/repositories/user-repository';
import { UsersMapper } from '../../../infra/mappers/users.mapper';
import { FetchUserUseCaseInput } from './dto/fetch-user.input.dto';
import { FetchUserUseCaseOutput } from './dto/fetch-user.output.dto';
import { UserNotFoundError } from '../../../domain/errors/user-not-found-error';

@Injectable()
export class FetchUserUseCase {
  private readonly logger: Logger;
  constructor(private readonly userRepository: UserRepository) {
    this.logger = new Logger(FetchUserUseCase.name);
  }

  async execute(
    input: FetchUserUseCaseInput,
  ): Promise<Either<Error, FetchUserUseCaseOutput>> {
    this.logger.log(`Call ${FetchUserUseCase.name}.execute method`);
    try {
      this.logger.log(
        `FetchUserUseCaseInput received: ${JSON.stringify(input)}`,
      );

      this.logger.log(`Fetching user by id: ${input.id}`);

      const user = await this.userRepository.findById(input.id);

      if (!user) {
        return left(new UserNotFoundError());
      }

      this.logger.log(`User found for id=${input.id}`);

      const output = UsersMapper.mapUserToFetchUserUseCaseOutput(user);

      return right(output);
    } catch (error) {
      const handledError =
        error instanceof Error ? error : new Error('Failed to fetch user');
      this.logger.error(
        `Error fetching user: ${handledError.message} stack: ${handledError.stack}`,
      );
      return left(handledError);
    }
  }
}
