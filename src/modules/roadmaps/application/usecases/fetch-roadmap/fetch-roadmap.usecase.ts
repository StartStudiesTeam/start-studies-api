import { Either, left, right } from '@/src/common/errors/either';
import { Injectable, Logger } from '@nestjs/common';
import { RoadmapRepository } from '../../../domain/repositories/roadmap-repository';
import { FetchRoadmapUseCaseInput } from './dto/fetch-roadmap.input.dto';
import { FetchRoadmapUseCaseOutput } from './dto/fetch-roadmap.output.dto';
import { UserRepository } from '@/src/modules/users/domain/repositories/user-repository';
import { RoadmapNotFoundError } from '../../../domain/errors/roadmap-not-found-error';
import { RoadmapFetchUserNotFoundError } from '../../../domain/errors/roadmap-fetch-user-not-found-error';
import { RoadmapsMapper } from '../../../infra/mappers/roadmaps.mapper';

type FetchRoadmapUseCaseError =
  | RoadmapNotFoundError
  | RoadmapFetchUserNotFoundError
  | Error;

@Injectable()
export class FetchRoadmapUseCase {
  private readonly logger = new Logger(FetchRoadmapUseCase.name);

  constructor(
    private readonly roadmapRepository: RoadmapRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(
    input: FetchRoadmapUseCaseInput,
  ): Promise<Either<FetchRoadmapUseCaseError, FetchRoadmapUseCaseOutput>> {
    this.logger.log(`Call ${FetchRoadmapUseCase.name}.execute method`);
    try {
      this.logger.log(
        `FetchRoadmapUseCaseInput received: ${JSON.stringify(input)}`,
      );

      this.logger.log(`Fetching roadmap by id: ${input.id}`);

      const roadmap = await this.roadmapRepository.findById(input.id);

      if (!roadmap) {
        return left(new RoadmapNotFoundError());
      }

      this.logger.log(
        `Roadmap found for id=${input.id}, fetching user by id: ${roadmap.userId}`,
      );

      const user = await this.userRepository.findById(roadmap.userId);

      if (!user || user.deletedAt) {
        return left(new RoadmapFetchUserNotFoundError());
      }

      this.logger.log(`User found for roadmap id=${input.id}`);

      const output = RoadmapsMapper.mapRoadmapToFetchRoadmapUseCaseOutput(
        roadmap,
        user,
      );

      return right(output);
    } catch (error) {
      const handledError =
        error instanceof Error ? error : new Error('Failed to fetch roadmap');
      this.logger.error(
        `Error fetching roadmap: ${handledError.message} stack: ${handledError.stack}`,
      );
      return left(handledError);
    }
  }
}
