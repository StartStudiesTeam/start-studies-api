import { Injectable, Logger } from '@nestjs/common';
import { Either, left, right } from '@/src/common/errors/either';
import { UserRepository } from '../../../domain/repositories/user-repository';
import { SearchUsersUseCaseInput } from './dto/search-users.input.dto';
import { UsersMapper } from '../../../infra/mappers/users.mapper';
import { SearchUsersUseCaseOutput } from './dto/search-users.output.dto';
import { SearchUsersPersistenceError } from '../../../domain/errors/search-users-persistence-error';

@Injectable()
export class SearchUsersUseCase {
  private readonly logger: Logger;
  constructor(private readonly userRepository: UserRepository) {
    this.logger = new Logger(SearchUsersUseCase.name);
  }

  async execute(
    input: SearchUsersUseCaseInput,
  ): Promise<Either<SearchUsersPersistenceError, SearchUsersUseCaseOutput>> {
    try {
      this.logger.log(`Call ${SearchUsersUseCase.name}.execute method`);

      const query = UsersMapper.mapToDomainQuery(input);

      const searchResult = await this.userRepository.searchByFilters(query);

      this.logger.log(
        `Users retrieved successfully: total=${searchResult.total}, count=${searchResult.users.length}`,
      );

      const output = UsersMapper.mapSearchUsersToOutput(searchResult);

      return right(output);
    } catch (error) {
      const handledError = new SearchUsersPersistenceError();
      this.logger.error(
        `Error searching users: ${handledError.message}`,
        error instanceof Error ? error.stack : undefined,
      );
      return left(handledError);
    }
  }
}
