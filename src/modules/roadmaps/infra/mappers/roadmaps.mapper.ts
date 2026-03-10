import { CreateRoadmapUseCaseInput } from '../../application/usecases/create-roadmap/dto/create-roadmap.input.dto';
import { CreateRoadmapUseCaseOutput } from '../../application/usecases/create-roadmap/dto/create-roadmap.output.dto';
import { Roadmap } from '../../domain/roadmap';
import { CreateRoadmapRequestDto } from '../dto/create-roadmap.request.dto';
import { CreateRoadmapResponseDto } from '../dto/create-roadmap.response.dto';

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
}
