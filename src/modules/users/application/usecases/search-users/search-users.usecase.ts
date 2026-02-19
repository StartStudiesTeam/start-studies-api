import { Injectable, Logger } from '@nestjs/common';
import { Either, left, right } from '@/src/common/errors/either';
import { UserRepository } from '../../../domain/repositories/user-repository';
import { SearchUsersUseCaseInput } from './dto/search-users.input.dto';
import { UsersMapper } from '../../../infra/mappers/users.mapper';
import { SearchUsersUseCaseOutput } from './dto/search-users.output.dto';

@Injectable()
export class SearchUsersUseCase {
  private readonly logger: Logger;
  constructor(private readonly userRepository: UserRepository) {
    this.logger = new Logger(SearchUsersUseCase.name);
  }

  async execute(
    input: SearchUsersUseCaseInput,
  ): Promise<Either<Error, SearchUsersUseCaseOutput>> {
    this.logger.log(`Call ${SearchUsersUseCase.name}.execute method`);

    try {
      this.logger.log(
        `SearchUsersUseCaseInput received: ${JSON.stringify(input)}`,
      );

      const searchInputType =
        UsersMapper.mapSearchUsersUseCaseInputToSearchUsersInputType(input);

      this.logger.log(
        `Mapped input for repository search: ${JSON.stringify(searchInputType)}`,
      );

      const searchOutputType =
        await this.userRepository.search(searchInputType);

      this.logger.log(
        `Users retrieved from repository: count=${searchOutputType.users.length}, total=${searchOutputType.total}`,
      );

      const output = UsersMapper.mapSearchUsersToOutput(searchOutputType);

      return right(output);
    } catch (error) {
      const handledError =
        error instanceof Error ? error : new Error('Failed to search users');
      this.logger.error(
        `Error searching users: ${handledError.message} stack: ${handledError.stack}`,
      );
      return left(handledError);
    }
  }
}
