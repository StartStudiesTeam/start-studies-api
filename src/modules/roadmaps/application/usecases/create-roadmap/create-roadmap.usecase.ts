import { UserRepository } from '@/src/modules/users/domain/repositories/user-repository';
import { Either, left, right } from '@/src/common/errors/either';
import { Injectable, Logger } from '@nestjs/common';
import { Roadmap } from '../../../domain/roadmap';
import { RoadmapRepository } from '../../../domain/repositories/roadmap-repository';
import { CreateRoadmapUseCaseInput } from './dto/create-roadmap.input.dto';
import { CreateRoadmapUseCaseOutput } from './dto/create-roadmap.output.dto';
import { RoadmapCreationUserNotFoundError } from '../../../domain/errors/roadmap-creation-user-not-found-error';
import { RoadmapsMapper } from '../../../infra/mappers/roadmaps.mapper';
import { RoadmapCreationUserDeletedError } from '../../../domain/errors/roadmap-creation-user-deleted-error';
import { InvalidRoadmapDataError } from '../../../domain/errors/invalid-roadmap-data-error';
import { RoadmapCreationPersistenceError } from '../../../domain/errors/roadmap-creation-persistence-error';

type CreateRoadmapUseCaseError =
  | RoadmapCreationUserNotFoundError
  | RoadmapCreationUserDeletedError
  | InvalidRoadmapDataError
  | RoadmapCreationPersistenceError;

@Injectable()
export class CreateRoadmapUseCase {
  private readonly logger = new Logger(CreateRoadmapUseCase.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly roadmapRepository: RoadmapRepository,
  ) {}

  async execute(
    input: CreateRoadmapUseCaseInput,
  ): Promise<Either<CreateRoadmapUseCaseError, CreateRoadmapUseCaseOutput>> {
    this.logger.log(`Call ${CreateRoadmapUseCase.name}.execute method`);

    try {
      const user = await this.userRepository.findById(input.userId);

      if (!user) {
        return left(new RoadmapCreationUserNotFoundError());
      }

      if (user.deletedAt) {
        return left(new RoadmapCreationUserDeletedError());
      }

      const roadmapOrError = Roadmap.create({
        ...input,
      });

      if (roadmapOrError.isLeft()) {
        return left(roadmapOrError.value);
      }

      const roadmap = await this.roadmapRepository.create(roadmapOrError.value);

      const output =
        RoadmapsMapper.mapRoadmapToCreateRoadmapUseCaseOutput(roadmap);

      return right(output);
    } catch (error) {
      const handledError =
        error instanceof Error ? error : new Error('Failed to create roadmap');

      this.logger.error(
        `Error creating roadmap: ${handledError.message} stack: ${handledError.stack}`,
      );

      return left(new RoadmapCreationPersistenceError());
    }
  }
}
