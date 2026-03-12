import { CreateRoadmapUseCaseInput } from '../../application/usecases/create-roadmap/dto/create-roadmap.input.dto';
import { CreateRoadmapUseCaseOutput } from '../../application/usecases/create-roadmap/dto/create-roadmap.output.dto';
import { FetchRoadmapUseCaseInput } from '../../application/usecases/fetch-roadmap/dto/fetch-roadmap.input.dto';
import { FetchRoadmapUseCaseOutput } from '../../application/usecases/fetch-roadmap/dto/fetch-roadmap.output.dto';
import { CreateRoadmapRequestDto } from '../dto/create-roadmap.request.dto';
import { CreateRoadmapResponseDto } from '../dto/create-roadmap.response.dto';
import { FetchRoadmapRequestDto } from '../dto/fetch-roadmap.request.dto';
import { FetchRoadmapResponseDto } from '../dto/fetch-roadmap.response.dto';
import { Roadmap } from '../../domain/roadmap';
import { User } from '@/src/modules/users/domain/user';

export class RoadmapsMapper {
  static mapCreateRoadmapRequestDtoToCreateRoadmapUseCaseInput(
    dto: CreateRoadmapRequestDto,
  ): CreateRoadmapUseCaseInput {
    return new CreateRoadmapUseCaseInput({
      title: dto.title,
      description: dto.description,
      userId: dto.userId,
      status: dto.status,
    });
  }

  static mapCreateRoadmapUseCaseOutputToCreateRoadmapResponseDto(
    output: CreateRoadmapUseCaseOutput,
  ): CreateRoadmapResponseDto {
    return {
      id: output.id,
      title: output.title,
      description: output.description,
      userId: output.userId,
      status: output.status,
    };
  }

  static mapRoadmapToCreateRoadmapUseCaseOutput(
    roadmap: Roadmap,
  ): CreateRoadmapUseCaseOutput {
    return new CreateRoadmapUseCaseOutput({
      id: roadmap.id,
      title: roadmap.title,
      description: roadmap.description,
      userId: roadmap.userId,
      status: roadmap.status,
    });
  }

  static mapRoadmapToFetchRoadmapUseCaseOutput(
    roadmap: Roadmap,
    user: User,
  ): FetchRoadmapUseCaseOutput {
    return new FetchRoadmapUseCaseOutput({
      id: roadmap.id,
      title: roadmap.title,
      description: roadmap.description,
      userId: roadmap.userId,
      status: roadmap.status,
      createdAt: roadmap.createdAt,
      updatedAt: roadmap.updatedAt,
      user: {
        name: user.name,
        nickname: user.nickname,
        status: user.status,
        userType: user.userType,
      },
    });
  }

  static mapFetchRoadmapRequestDtoToFetchRoadmapUseCaseInput(
    dto: FetchRoadmapRequestDto,
  ): FetchRoadmapUseCaseInput {
    return {
      id: dto.id,
    };
  }

  static mapFetchRoadmapUseCaseOutputToFetchRoadmapResponseDto(
    output: FetchRoadmapUseCaseOutput,
  ): FetchRoadmapResponseDto {
    return {
      id: output.id,
      title: output.title,
      description: output.description,
      userId: output.userId,
      status: output.status,
      createdAt: output.createdAt,
      updatedAt: output.updatedAt,
      user: {
        name: output.user.name,
        nickname: output.user.nickname,
        status: output.user.status,
        userType: output.user.userType,
      },
    };
  }
}
