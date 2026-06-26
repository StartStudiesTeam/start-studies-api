import { Injectable, Logger } from '@nestjs/common';
import { Either, left, right } from '@/src/common/errors/either';
import { RoadmapRepository } from '../../../domain/repositories/roadmap-repository';
import { SearchRoadmapUseCaseInput } from './dto/search-roadmap.input.dto';
import { SearchRoadmapUseCaseOutput } from './dto/search-roadmap.output.dto';
import { RoadmapsMapper } from '../../../infra/mappers/roadmaps.mapper';
import { SearchRoadmapPersistenceError } from '../../../domain/errors/search-roadmap-persistence-error';

@Injectable()
export class SearchRoadmapUseCase {
  private readonly logger: Logger;
  constructor(private readonly roadmapRepository: RoadmapRepository) {
    this.logger = new Logger(SearchRoadmapUseCase.name);
  }

  async execute(
    input: SearchRoadmapUseCaseInput,
  ): Promise<
    Either<SearchRoadmapPersistenceError, SearchRoadmapUseCaseOutput>
  > {
    try {
      this.logger.log(`Call ${SearchRoadmapUseCase.name}.execute method`);

      const query = RoadmapsMapper.mapToDomainQuery(input);

      const searchResult = await this.roadmapRepository.searchByFilters(query);

      this.logger.log(
        `Roadmaps retrieved successfully: total=${searchResult.total}, count=${searchResult.roadmaps.length}`,
      );

      const output = RoadmapsMapper.mapSearchRoadmapsToOutput(searchResult);

      return right(output);
    } catch (error) {
      const handledError = new SearchRoadmapPersistenceError();
      this.logger.error(
        `Error searching roadmaps: ${handledError.message}`,
        error instanceof Error ? error.stack : undefined,
      );
      return left(handledError);
    }
  }
}
